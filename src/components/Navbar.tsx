import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from 'react-dom';
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getAssetUrl } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getCart } from '@/lib/shopify-cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShopifyCustomer } from '@/contexts/ShopifyCustomerContext';
import { useProducts } from '@/hooks/useProducts';
import { normalizeCategory } from '@/lib/normalize';

const logoImage = getAssetUrl("Gai_logo.svg");

// Fallback collections shown while Shopify data is loading
const FALLBACK_COLLECTIONS = [
  { name: "Rings", path: "/collections?category=Rings" },
  { name: "Earrings", path: "/collections?category=Earrings" },
  { name: "Necklaces", path: "/collections?category=Necklaces" },
  { name: "Bangles", path: "/collections?category=Bangles" },
  { name: "Bracelets", path: "/collections?category=Bracelets" },
];

const STORY_LINKS = [
  { name: "Our Story", path: "/about/story" },
  { name: "Materials", path: "/about/material" },
  { name: "Design", path: "/about/design" },
  { name: "Craftsmanship", path: "/about/craftsmanship" },
];

const SUPPORT_LINKS = [
  { name: "FAQ", path: "/faq" },
  { name: "Jewellery Care", path: "/pages/jewellery-care" },
  { name: "Warranty", path: "/pages/warranty" },
  { name: "Size Guide", path: "/pages/size-guide" },
];

const LEGAL_LINKS = [
  { name: "Refund Policy", path: "/refund-policy" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  useEffect(() => {
    const readScrollTop = () =>
      Math.max(
        window.pageYOffset || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0,
      );

    let raf = 0;
    const handleScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        setIsScrolled(readScrollTop() > 24);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [location.pathname]);

  // Publish the navbar height as a CSS variable so other components (eg. sidebar)
  // can offset themselves below the fixed header and avoid overlap.
  React.useEffect(() => {
    function updateNavHeight() {
      try {
        const h = headerRef.current?.offsetHeight ?? 0;
        document.documentElement.style.setProperty(
          "--shopify-navbar-height",
          `${h}px`
        );
      } catch (e) {}
    }

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, [isScrolled]);

  const isHome = location.pathname === "/";
  const isTransparentMode = isHome && !isScrolled;
  const isMobile = useIsMobile();
  const isMobileSmall = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return currentPath === path || location.pathname === path;
  };

  const isMenuSectionActive = (links: { path: string }[]) => {
    return links.some(link => isActive(link.path));
  };

  // Dynamic collections from Shopify products
  const { products: navProducts } = useProducts();
  const dynamicCollections = useMemo(() => {
    if (navProducts.length === 0) return FALLBACK_COLLECTIONS;

    const countMap = new Map<string, number>();
    navProducts.forEach(p => {
      const raw = String(p.category || "").trim();
      if (!raw || raw.toLowerCase() === "jewellery") return;
      const normalized = normalizeCategory(raw);
      countMap.set(normalized, (countMap.get(normalized) || 0) + 1);
    });

    // Sort by product count (most first)
    const sorted = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => ({
        name,
        path: `/collections?category=${encodeURIComponent(name)}`,
      }));

    return sorted.length > 0 ? sorted : FALLBACK_COLLECTIONS;
  }, [navProducts]);

  const [cartCount, setCartCount] = useState<number>(0);
  const { customer: shopifyCustomer } = useShopifyCustomer();

  useEffect(() => {
    // Initialize cart count and listen for updates
    let mounted = true;
    async function fetchCart() {
      try {
        const cart = await getCart();
        if (!mounted) return;
        setCartCount(cart?.item_count ?? 0);
      } catch (err) {
        console.warn('Failed to fetch cart count', err);
      }
    }
    fetchCart();

    const cartHandler = async () => {
      try {
        const cart = await getCart();
        if (!mounted) return;
        setCartCount(cart?.item_count ?? 0);
      } catch (err) {
        console.warn('Failed to refresh cart count', err);
      }
    };
    window.addEventListener('cart:updated', cartHandler as EventListener);
    
    return () => {
      mounted = false;
      window.removeEventListener('cart:updated', cartHandler as EventListener);
    };
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const latestSearchRequestRef = useRef(0);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(searchQuery)}&resources[type]=product&resources[limit]=10`, {
          credentials: 'same-origin',
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Predictive search failed with status ${response.status}`);
        }
        const data = await response.json();
        const prods = data.resources.results.products || [];

        if (controller.signal.aborted || requestId !== latestSearchRequestRef.current) {
          return;
        }
        
        // Strict prefix matching: query must be a literal starting substring of at least one word in the title
        const filtered = prods.filter((p: any) => {
          const titleWords = p.title.toLowerCase().split(/\s+/);
          // For multi-word queries, we ensure the last word is a prefix and previous words match fully
          // But for simplicity and based on user request ('pend' -> 'pendant'), 
          // we check if the entire query matches a prefix of a word or start of the title.
          const queryLower = searchQuery.toLowerCase().trim();
          const titleLower = p.title.toLowerCase();
          
          return titleWords.some((word: string) => word.startsWith(queryLower)) || titleLower.startsWith(queryLower);
        }).slice(0, 4);

        setSuggestions(filtered);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Predictive search failed", err);
        }
      } finally {
        if (requestId === latestSearchRequestRef.current) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const ListItem = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link> & { title: string }
  >(({ className, title, children, to, ...props }, ref) => {
    const active = isActive(to as string);
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={to}
            className={cn(
              "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gold-500/5",
              className
            )}
            {...props}
          >
            <div className={cn(
              "text-sm font-medium leading-none uppercase tracking-widest transition-colors",
              active ? "text-secondary font-bold" : "text-zinc-900 group-hover:text-secondary"
            )}>{title}</div>
            <p className="line-clamp-2 text-xs leading-snug text-zinc-600 italic group-hover:text-zinc-800 transition-colors">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem";

  const SidebarContent = () => {
    return (
      <>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex flex-col space-y-8">
          {isMobileSmall && (
            <div className="flex items-center justify-between px-4 pb-4 border-b border-secondary/20">
              <Link to="/wishlist" className="flex items-center gap-2 text-secondary">
                <Heart className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Wishlist</span>
              </Link>
              <a href="/account" className="flex items-center gap-2 text-secondary">
                <User className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Account</span>
              </a>
            </div>
          )}

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-secondary mb-4 px-4 font-bold">Collections</h3>
            <div className="flex flex-col space-y-4">
              {dynamicCollections.map((link) => (
                <Link key={link.path} to={link.path} className={cn(
                  "text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 rounded-sm",
                  isActive(link.path) ? "bg-secondary/10 text-secondary font-bold" : "text-zinc-700 hover:bg-secondary/10 hover:text-secondary"
                )}>{link.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-secondary mb-4 px-4 font-bold">About Us</h3>
            <div className="flex flex-col space-y-4">
              {STORY_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className={cn(
                  "text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 rounded-sm",
                  isActive(link.path) ? "bg-secondary/10 text-secondary font-bold" : "text-zinc-700 hover:bg-secondary/10 hover:text-secondary"
                )}>{link.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-secondary mb-4 px-4 font-bold">Support</h3>
            <div className="flex flex-col space-y-4">
              {SUPPORT_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className={cn(
                  "text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 rounded-sm",
                  isActive(link.path) ? "bg-secondary/10 text-secondary font-bold" : "text-zinc-700 hover:bg-secondary/10 hover:text-secondary"
                )}>{link.name}</Link>
              ))}
              <Link to="/contact" className={cn(
                "text-sm uppercase tracking-widest px-4 py-3 transition-all duration-300 font-bold border-t border-zinc-200",
                isActive("/contact") ? "text-secondary" : "text-zinc-800 hover:bg-secondary/10 hover:text-secondary"
              )}>Contact Us</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200">
            <div className="flex flex-col space-y-2 opacity-80">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className={cn(
                  "text-[9px] uppercase tracking-[0.3em] px-4",
                  isActive(link.path) ? "text-secondary font-bold" : "text-zinc-700 hover:text-secondary"
                )}>{link.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const headerMarkup = (
    <header ref={headerRef} className="fixed left-0 right-0 top-0 z-[1200] translate-y-0 opacity-100" data-navbar="shopify-navbar">
      {/* Search Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/40 backdrop-blur-md z-[60] transition-all duration-500",
        isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSearchOpen(false)}>
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 bg-[#fdf8f2] border-b border-secondary/20 p-8 md:p-12 transition-transform duration-500 overflow-y-auto max-h-[80vh]",
            isSearchOpen ? "translate-y-0" : "-translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <form onSubmit={handleSearch} className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a0509]/60 group-focus-within:text-[#1a0509] transition-colors" />
                <input
                  autoFocus={isSearchOpen}
                  type="text"
                  placeholder="Experience the beauty of House of Midas..."
                  className="w-full bg-white/50 border-b-2 border-secondary/30 py-4 pl-14 pr-4 font-playfair-display text-2xl italic text-[#1a0509] placeholder:text-[#1a0509]/30 focus:outline-none focus:border-secondary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button 
                variant="ghost" 
                className="text-secondary hover:text-[#1a0509] uppercase tracking-widest text-[10px] font-bold"
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </Button>
            </div>

            {/* Live Results */}
            {searchQuery.trim() && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-secondary/10 pb-4">
                  <h3 className="font-playfair-display text-xl font-bold text-[#1a0509] italic">Live Discoveries</h3>
                  {isSearching && <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />}
                </div>
                
                {suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suggestions.map((product) => (
                      <a 
                        key={product.id} 
                        href={product.url}
                        className="group flex flex-col bg-white/40 p-3 rounded-2xl border border-secondary/5 hover:border-secondary/20 transition-all duration-300"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f3efe8] mb-3">
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h4 className="font-jost text-[10px] uppercase tracking-widest text-[#1a0509] font-bold truncate mb-1">{product.title}</h4>
                        <p className="font-jost text-xs text-secondary font-medium">{product.price}</p>
                      </a>
                    ))}
                  </div>
                ) : !isSearching && (
                  <p className="text-[#1a0509]/40 italic font-playfair-display text-lg py-4 text-center">Your unique desire remains unmatched...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav
        className={cn(
          "transition-all duration-500 border-b",
          isTransparentMode
            ? "bg-transparent border-transparent py-6"
            : "bg-black/95 backdrop-blur-md border-[#C6A75E]/20 py-3 shadow-sm"
        )}
      >
        <div className="container mx-auto px-6 md:px-10 max-w-none">
          <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-14 xl:gap-20">
            {/* Left Section */}
            <div className="flex items-center gap-4 min-w-0">
              <Link to="/" className={cn("flex items-center justify-center shrink-0 pr-6 border-r overflow-hidden", isTransparentMode ? "border-[#C6A75E]/35" : "border-[#C6A75E]/25")}>
                <img src={logoImage} alt="GAI logo" className="h-10 w-10 flex-shrink-0 rounded-full object-cover aspect-square" />
              </Link>

              <NavigationMenu viewportClassName={cn("bg-[#fdf8f2] border-secondary/20 shadow-2xl rounded-none", isTransparentMode ? "mt-[33px]" : "mt-[21px]")}> 
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "group relative bg-transparent hover:bg-transparent text-[12px] uppercase tracking-[0.24em] transition-all duration-300 h-auto py-2",
                      "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full hover:after:left-0",
                      isMenuSectionActive(dynamicCollections) ? "text-secondary font-bold" : isTransparentMode ? "text-white" : "text-[#C6A75E]"
                    )}>
                      Collections
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul 
                        className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] border-secondary/20 shadow-xl"
                        style={{
                          background: "linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)"
                        }}
                      >
                        {dynamicCollections.map((link) => (
                          <ListItem
                            key={link.path}
                            title={link.name}
                            to={link.path}
                          >
                            Explore our exquisite {link.name.toLowerCase()} pieces.
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "group relative bg-transparent hover:bg-transparent text-[12px] uppercase tracking-[0.24em] transition-all duration-300 h-auto py-2",
                      "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full hover:after:left-0",
                      isMenuSectionActive(STORY_LINKS) ? "text-secondary font-bold" : isTransparentMode ? "text-white" : "text-[#C6A75E]"
                    )}>
                      About Us
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul 
                        className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] border-secondary/20 shadow-xl"
                        style={{
                          background: "linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)"
                        }}
                      >
                        {STORY_LINKS.map((link) => (
                          <ListItem
                            key={link.path}
                            title={link.name}
                            to={link.path}
                          >
                            Discover the heart and soul of House of Midas.
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Middle Section (Logo) */}
            <div className="flex flex-col items-center leading-none whitespace-nowrap px-4 -mt-[0.1px]">
              <span className={cn("mb-2 text-[9px] font-cinzel uppercase tracking-[0.42em]", isTransparentMode ? "text-[#C6A75E]/90" : "text-[#C6A75E]/85")}>
                Maison De Luxe
              </span>
              <Link
                to="/"
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={cn(
                  "font-cinzel text-[clamp(20px,2.2vw,32px)] font-bold tracking-[0.12em]",
                  isTransparentMode ? "text-white" : "text-[#C6A75E]"
                )}
              >
                HOUSE OF MIDAS LUXE
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-end gap-0  min-w-5">
               <NavigationMenu viewportClassName={cn("bg-[#fdf8f2] border-secondary/20 shadow-2xl rounded-none", isTransparentMode ? "mt-[33px]" : "mt-[21px]")}> 
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "group relative bg-transparent hover:bg-transparent text-[12px] uppercase tracking-[0.24em] transition-all duration-300 h-auto py-2",
                      "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full hover:after:left-0",
                      isMenuSectionActive(SUPPORT_LINKS) ? "text-secondary font-bold" : isTransparentMode ? "text-white" : "text-[#C6A75E]"
                    )}>
                      Support
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul 
                        className="grid w-[300px] gap-3 p-4 border-secondary/20 shadow-xl"
                        style={{
                          background: "linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)"
                        }}
                      >
                        {SUPPORT_LINKS.map((link) => (
                          <ListItem
                            key={link.path}
                            title={link.name}
                            to={link.path}
                          />
                        ))}
                        <hr className="border-secondary/20 my-2" />
                        {LEGAL_LINKS.map((link) => (
                           <Link key={link.path} to={link.path} className={cn(
                             "block p-3 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-gold-500/5 rounded-sm",
                             isActive(link.path) ? "text-secondary font-bold" : "text-zinc-700 hover:text-secondary"
                           )}>
                             {link.name}
                           </Link>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                to="/contact"
                className={cn(
                  "group relative text-[12px] uppercase tracking-[0.24em] whitespace-nowrap transition-all duration-300 px-4 py-2",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full hover:after:left-0",
                  location.pathname === "/contact" ? "text-secondary font-bold" : isTransparentMode ? "text-white" : "text-[#C6A75E]"
                )}
              >
                Contact
              </Link>

              <div className={cn("flex items-center gap-2 border-l pl-5", isTransparentMode ? "border-[#C6A75E]/35" : "border-[#C6A75E]/25")}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("hover:bg-transparent transition-colors", isSearchOpen || isActive("/search") ? "text-secondary" : "text-secondary hover:text-secondary/80")}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className={cn("hover:bg-transparent transition-colors", isActive("/wishlist") ? "text-secondary" : "text-secondary hover:text-secondary/80")}>
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="/account" className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className={cn("hover:bg-transparent transition-colors", isActive("/account") ? "text-secondary" : "text-secondary hover:text-secondary/80")}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  {shopifyCustomer?.firstName ? (
                      <span className={cn("hidden md:inline-block text-[12px] font-medium ml-2", isTransparentMode ? "text-white" : "text-secondary")}>{shopifyCustomer.firstName}</span>
                    ) : null}
                </a>
                <a href="/cart">
                  <Button variant="ghost" size="icon" className={cn("relative hover:bg-transparent transition-colors", isActive("/cart") ? "text-secondary" : "text-secondary hover:text-secondary/80")}>
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-white">{cartCount}</span>
                    ) : (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
                    )}
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex items-center justify-between xl:hidden relative">
            {/* Logo on the left */}
            <Link to="/" className="flex items-center shrink-0 mr-2">
              <img src={logoImage} alt="GAI logo" className="h-9 w-9 md:h-16 md:w-16 flex-shrink-0 rounded-full object-cover aspect-square" />
            </Link>

            {/* Brand centered */}
            <Link to="/" className="xl:absolute xl:left-1/2 xl:transform xl:-translate-x-1/2">
              <span className={cn("text-base md:text-2xl font-playfair-display font-bold tracking-[0.12em] md:tracking-[0.15em] truncate", isTransparentMode ? "text-white" : "text-[#C6A75E]")}> 
                 HOUSE OF MIDAS LUXE
              </span>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("transition-colors w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11", isSearchOpen || isActive("/search") ? "text-secondary" : "text-secondary hover:text-secondary/80")}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </Button>
              <Link to="/wishlist" className="hidden md:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "transition-colors w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11",
                    isActive("/wishlist") ? "text-secondary" : "text-secondary hover:text-secondary/80"
                  )}
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
              </Link>

              <a href="/account" className="hidden md:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "transition-colors w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11",
                    isActive("/account") ? "text-secondary" : "text-secondary hover:text-secondary/80"
                  )}
                >
                  <User className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
              </a>

              <a href="/cart">
                <Button variant="ghost" size="icon" className={cn("relative transition-colors w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11", isActive("/cart") ? "text-secondary" : "text-secondary hover:text-secondary/80")} aria-label="Cart">
                  <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {cartCount > 0 ? (
                    <span className="absolute -right-1 -top-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-white">{cartCount}</span>
                  ) : (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
                  )}
                </Button>
              </a>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary/80 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11" aria-label="Menu">
                    <Menu className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="border-l border-secondary/30 text-zinc-900 flex flex-col pt-16 overflow-y-auto shadow-2xl"
                  style={{
                    background: "linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)"
                  }}
                >
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );

  // Render into portal if available (Shopify theme) to avoid transformed ancestors
  if (typeof document !== 'undefined') {
    const portal = document.getElementById('shopify-navbar-portal');
    if (portal) return createPortal(headerMarkup, portal);
  }

  return headerMarkup;
};

export default Navbar;






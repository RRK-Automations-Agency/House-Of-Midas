import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white pt-20">
      <div className="container mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-cinzel font-bold tracking-[0.25em] text-[#C6A75E]">
              HOUSE OF MIDAS
            </Link>
            <p className="text-[14px] font-cormorant italic leading-relaxed text-zinc-400 max-w-xs mx-auto md:mx-0">
              Defining the pinnacle of high jewelry through artistic excellence and exceptional gemstones since 1920.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-6 pt-2">
              <a href="https://www.instagram.com/houseofmidas.luxe/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#C6A75E] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@houseofmidas.luxe" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#C6A75E] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.92-.35-2.81.07-.59.29-1.07.73-1.4 1.3-.44.73-.55 1.63-.33 2.46.22 1.05.9 1.99 1.8 2.5 1.05.62 2.37.66 3.44.11 1.02-.51 1.69-1.52 1.83-2.63.09-2.73.04-5.46.05-8.18l.04-10.34z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61565578125138" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#C6A75E] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[17px] uppercase tracking-[0.35em] font-semibold text-[#C6A75E]/80">Quick Links</h4>
            <ul className="space-y-2.5 text-[15px] font-jost tracking-wide">
              <li><Link to="/faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/refund-policy" className="text-zinc-400 hover:text-white transition-colors">Replacement & Cancellation</Link></li>
              <li><Link to="/pages/jewellery-care" className="text-zinc-400 hover:text-white transition-colors">Jewellery Care</Link></li>
              <li><Link to="/pages/warranty" className="text-zinc-400 hover:text-white transition-colors">Warranty</Link></li>
              <li><Link to="/pages/size-guide" className="text-zinc-400 hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div className="space-y-4">
            <h4 className="text-[17px] uppercase tracking-[0.35em] font-semibold text-[#C6A75E]/80">About Us</h4>
            <ul className="space-y-2.5 text-[15px] font-jost tracking-wide">
              <li><Link to="/about/story" className="text-zinc-400 hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link to="/about/craftsmanship" className="text-zinc-400 hover:text-white transition-colors">Quality & Craftsmanship</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-[17px] uppercase tracking-[0.35em] font-semibold text-[#C6A75E]/80">Contact</h4>
            <ul className="space-y-3 text-[15px] font-jost tracking-wide text-zinc-400">
              <li className="flex items-center justify-center md:justify-start space-x-3 italic">
                <Mail className="w-4 h-4 text-[#C6A75E]/50" />
                <a href="mailto:houseofmidas.luxe@gmail.com" className="hover:text-white transition-colors">
                  houseofmidas.luxe@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-4 h-4 text-[#C6A75E]/50" />
                <a href="tel:+917733979115" className="hover:text-white transition-colors">
                  +91 77339 79115
                </a>
              </li>
              <li className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] leading-relaxed pt-2">
                SURAT, GUJARAT — INDIA
              </li>
            </ul>
          </div>

        </div>
      </div>
 

      {/* Bottom Footer */}
      <div className="bg-black py-8 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
          <p>© {currentYear} HOUSE OF MIDAS LUXE. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8">
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

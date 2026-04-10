import type { ReactNode } from 'react';

import Home from './pages/Home';
import Collections from './pages/Collections';
import Luxe from './pages/Luxe';
import About from './pages/About';
import AboutStory from './pages/AboutStory';
import AboutMaterial from './pages/AboutMaterial';
import AboutDesign from './pages/AboutDesign';
import AboutCraftsmanship from './pages/AboutCraftsmanship';
import FAQ from './pages/FAQ';
import JewelleryCare from './pages/JewelleryCare';
import Warranty from './pages/Warranty';
import SizeGuide from './pages/SizeGuide';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import AccountRedirect from './pages/AccountRedirects';
import ProductDetails from './pages/ProductDetails';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  
  {
    name: 'Collections',
    path: '/collections',
    element: <Collections />
  },
  {
    name: 'Account',
    path: '/account',
    element: <AccountRedirect target="orders" />,
    visible: false
  },
  {
    name: 'Login',
    path: "/account/login",
    element: <AccountRedirect target="login" />,
    visible: false
  },
  {
    name: 'Register',
    path: "/account/register",
    element: <AccountRedirect target="register" />,
    visible: false
  },
  {
    name: 'Logout',
    path: "/account/logout",
    element: <AccountRedirect target="logout" />,
    visible: false
  },
  {
    name: 'Orders',
    path: '/account/orders',
    element: <AccountRedirect target="orders" />,
    visible: false
  },
  {
    name: 'Addresses',
    path: '/account/addresses',
    element: <AccountRedirect target="addresses" />,
    visible: false
  },
  {
    name: 'Security',
    path: '/account/security',
    element: <AccountRedirect target="login" />, // Password management usually requires re-login
    visible: false
  },
  {
    name: 'Luxe',
    path: '/luxe',
    element: <Luxe />
  },
  {
    name: 'About',
    path: '/about',
    element: <About />
  },
  {
    name: 'Our Story',
    path: '/about/story',
    element: <AboutStory />
  },
  {
    name: 'Material',
    path: '/about/material',
    element: <AboutMaterial />
  },
  {
    name: 'Design',
    path: '/about/design',
    element: <AboutDesign />
  },
  {
    name: 'Craftsmanship',
    path: '/about/craftsmanship',
    element: <AboutCraftsmanship />
  },
  {
    name: 'FAQ',
    path: '/faq',
    element: <FAQ />
  },
  {
    name: 'Jewellery Care',
    path: '/pages/jewellery-care',
    element: <JewelleryCare />
  },
  {
    name: 'Warranty',
    path: '/pages/warranty',
    element: <Warranty />
  },
  {
    name: 'Size Guide',
    path: '/pages/size-guide',
    element: <SizeGuide />
  },
  {
    name: 'Refund Policy',
    path: '/refund-policy',
    element: <RefundPolicy />
  },
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    name: 'Terms of Service',
    path: '/terms-of-service',
    element: <TermsOfService />
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <AccountRedirect target="cart" />,
    visible: false
  },
  {
    name: 'Wishlist',
    path: '/wishlist',
    element: <Wishlist />,
    visible: true
  },
  {
    name: 'Product Details',
    path: '/products/:handle',
    element: <ProductDetails />,
    visible: false
  },
  {
    name: 'Search',
    path: '/search',
    element: <AccountRedirect target="search" />,
    visible: false
  }
];

export default routes;

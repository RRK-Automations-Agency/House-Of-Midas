import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { ShopifyCustomerProvider } from '@/contexts/ShopifyCustomerContext';

import routes from './routes';
import ScrollToTop from '@/components/common/ScrollToTop';
import NotFound from '@/pages/NotFound';
import RouteMeta from '@/components/common/RouteMeta';

const RouteLoadingFallback: React.FC = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary"
      aria-label="Loading route"
      role="status"
    />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <RouteMeta />
      <ShopifyCustomerProvider>
        <IntersectObserver />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        <Toaster />
      </ShopifyCustomerProvider>
    </Router>
  );
};

export default App;

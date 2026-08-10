import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderProvider } from '@/context/OrderContext';
import { ReviewsProvider } from '@/context/ReviewsContext';
import { DisputesProvider } from '@/context/DisputesContext';
import { VendorProvider } from '@/context/VendorContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { LiveChatWidget } from '@/components/LiveChatWidget';

import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import ProductsPage from '@/pages/ProductsPage';
import ShopsPage from '@/pages/ShopsPage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import OwnerPage from '@/pages/OwnerPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import RiderTrackingPage from '@/pages/RiderTrackingPage';
import ProfilePage from '@/pages/ProfilePage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import DisputesPage from '@/pages/DisputesPage';
import ChatPage from '@/pages/ChatPage';
import ChatHomePage from '@/pages/ChatHomePage';
import NotificationsPage from '@/pages/NotificationsPage';
import { HelpPage, ReturnsPage, AboutPage, TermsPage, PrivacyPage } from '@/pages/StaticPages';
import { OpenShopPage, VendorDashboardPage, SellerPoliciesPage } from '@/pages/VendorPages';

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductsPage} />
          <Route path="/map" component={MapPage} />
          <Route path="/shops" component={ShopsPage} />
          <Route path="/shop/:id" component={ShopPage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/confirmation" component={ConfirmationPage} />
          <Route path="/sign-in" component={SignInPage} />
          <Route path="/sign-up" component={SignUpPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/reset-password" component={ResetPasswordPage} />
          <Route path="/owner" component={OwnerPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/orders/:id" component={OrderTrackingPage} />
          <Route path="/orders/:id/tracking" component={RiderTrackingPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/search" component={SearchResultsPage} />
          <Route path="/chat" component={ChatHomePage} />
          <Route path="/chat/:id" component={ChatPage} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/disputes" component={DisputesPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/returns" component={ReturnsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/vendors/open-shop" component={OpenShopPage} />
          <Route path="/vendors/dashboard" component={VendorDashboardPage} />
          <Route path="/vendors/policies" component={SellerPoliciesPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <LiveChatWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <ReviewsProvider>
                <DisputesProvider>
                  <VendorProvider>
                    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                      <Router />
                    </WouterRouter>
                    <Toaster />
                  </VendorProvider>
                </DisputesProvider>
              </ReviewsProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

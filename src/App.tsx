import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Access from "./pages/Access";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import SetPassword from "./pages/SetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplications from "./pages/admin/Applications";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminContactMessages from "./pages/admin/ContactMessages";
import AdminBusinesses from "./pages/admin/Businesses";
import AdminMessagesCenter from "./pages/admin/MessagesCenter";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminDraftOrders from "./pages/admin/DraftOrders";
import AdminCreateDraftOrder from "./pages/admin/CreateDraftOrder";
import AdminShippingLabels from "./pages/admin/ShippingLabels";
import AdminAbandonedCheckouts from "./pages/admin/AbandonedCheckouts";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSuppliers from "./pages/admin/Suppliers";
import TrackOrder from "./pages/TrackOrder";
import PortalDashboard from "./pages/portal/Dashboard";
import PortalProducts from "./pages/portal/Products";
import PortalOrders from "./pages/portal/Orders";
import PortalMessages from "./pages/portal/Messages";
import PortalProfile from "./pages/portal/Profile";
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierOrders from "./pages/supplier/Orders";
import SupplierOrderFulfillment from "./pages/supplier/OrderFulfillment";
import SupplierMessages from "./pages/supplier/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/account" element={<Access />} />
            <Route path="/set-password" element={<SetPassword />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/new" element={<AdminCreateDraftOrder />} />
            <Route path="/admin/orders/drafts" element={<AdminDraftOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/track/:orderNumber" element={<TrackOrder />} />
            <Route path="/admin/shipping-labels" element={<AdminShippingLabels />} />
            <Route path="/admin/abandoned-checkouts" element={<AdminAbandonedCheckouts />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/messages" element={<AdminContactMessages />} />
            <Route path="/admin/businesses" element={<AdminBusinesses />} />
            <Route path="/admin/messages-center" element={<AdminMessagesCenter />} />
            <Route path="/admin/suppliers" element={<AdminSuppliers />} />
            {/* Supplier Portal Routes */}
            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/orders" element={<SupplierOrders />} />
            <Route path="/supplier/orders/:id" element={<SupplierOrderFulfillment />} />
            <Route path="/supplier/messages" element={<SupplierMessages />} />
            {/* Client Portal Routes */}
            <Route path="/portal" element={<PortalDashboard />} />
            <Route path="/portal/products" element={<PortalProducts />} />
            <Route path="/portal/orders" element={<PortalOrders />} />
            <Route path="/portal/messages" element={<PortalMessages />} />
            <Route path="/portal/profile" element={<PortalProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
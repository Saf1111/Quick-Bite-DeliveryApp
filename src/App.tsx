import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { QuickProfileModal } from './components/common/QuickProfileModal';
import { SurpriseBiteModal } from './components/home/SurpriseBiteModal';
import { MealBuilderModal } from './components/mealBuilder/MealBuilderModal';
import { SmartSearchModal } from './components/search/SmartSearchModal';
import { CartDrawer } from './components/cart/CartDrawer';

// Views
import { HomeView } from './components/home/HomeView';
import { RestaurantDetailView } from './components/restaurant/RestaurantDetailView';
import { DistrictMapView } from './components/map/DistrictMapView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { PartnerKitchenView } from './components/partner/PartnerKitchenView';
import { DeliveryPartnerView } from './components/delivery/DeliveryPartnerView';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, selectedRestaurantId, setSelectedRestaurantId } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}

        {activeView === 'restaurant' && (
          <RestaurantDetailView
            restaurantId={selectedRestaurantId || 'rest-technopark-kerala-kitchen'}
            onBack={() => setActiveView('home')}
          />
        )}

        {activeView === 'map' && (
          <DistrictMapView
            onSelectRestaurant={(id) => {
              setSelectedRestaurantId(id);
              setActiveView('restaurant');
            }}
          />
        )}

        {activeView === 'checkout' && <CheckoutView />}

        {activeView === 'orders' && <OrderTrackingView />}

        {activeView === 'account' && <AccountView />}

        {activeView === 'admin' && <AdminDashboardView />}

        {activeView === 'partner' && <PartnerKitchenView />}

        {activeView === 'delivery' && <DeliveryPartnerView />}
      </main>

      {/* Global Footer (shown on all public customer views) */}
      {activeView !== 'map' && activeView !== 'admin' && activeView !== 'partner' && activeView !== 'delivery' && <Footer />}

      {/* Global Modals, Drawers & Overlays */}
      <CartDrawer />
      <QuickProfileModal />
      <SurpriseBiteModal />
      <MealBuilderModal />
      <SmartSearchModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

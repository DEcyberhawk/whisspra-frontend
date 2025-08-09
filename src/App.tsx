import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { OfflineProvider } from './context/OfflineContext';
import { SocketProvider } from './context/SocketContext';
import { SettingsProvider } from './context/SettingsContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/notifications/NotificationContainer';
import OfflineBanner from './components/OfflineBanner';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import DeveloperPage from './pages/admin/DeveloperPage';
import UsersPage from './pages/admin/UsersPage';
import ReportsPage from './pages/admin/ReportsPage';
import VerificationPage from './pages/admin/VerificationPage';
import SettingsPage from './pages/admin/SettingsPage';
import BusinessPage from './pages/BusinessPage';
import StorefrontPage from './pages/StorefrontPage';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import MainLayoutPage from './pages/MainLayoutPage';
import ChatPage from './pages/ChatPage';
import LiveStageLobbyPage from './pages/LiveStageLobbyPage';
import EchoesLobbyPage from './pages/EchoesLobbyPage';
import VodPlayerPage from './pages/VodPlayerPage';
import WalletPage from './pages/WalletPage';
import DreamscapeLobbyPage from './pages/DreamscapeLobbyPage';
import DreamscapeViewerPage from './pages/DreamscapeViewerPage';
import FeaturesPage from './pages/admin/FeaturesPage';
import UpgradePage from './pages/UpgradePage';
import CommunityLoungePage from './pages/CommunityLoungePage';
import MarketplaceLobby from './components/marketplace/MarketplaceLobby';
import NotFoundPage from './pages/NotFoundPage';
import ForgePage from './pages/admin/ForgePage';  // Import only once

const NativeSetup: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, [theme]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/store/:userId" element={<StorefrontPage />} />
      <Route path="/upgrade" element={<UpgradePage />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayoutPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<ChatPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="echoes" element={<EchoesLobbyPage />} />
        <Route path="live" element={<LiveStageLobbyPage />} />
        <Route path="/admin/forge" element={<AdminRoute><ForgePage /></AdminRoute>} />
        <Route path="dreamscapes" element={<DreamscapeLobbyPage />} />
        <Route path="market" element={<MarketplaceLobby />} />
        <Route path="edu" element={<CommunityLoungePage onJoinCommunity={() => {}}/>} />
        <Route path="wallet" element={<WalletPage />} />
      </Route>
      
      <Route path="/vod/:streamId" element={<ProtectedRoute><VodPlayerPage /></ProtectedRoute>} />
      <Route path="/dreamscape/:id" element={<ProtectedRoute><DreamscapeViewerPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
      <Route path="/admin/developer" element={<AdminRoute><DeveloperPage /></AdminRoute>} />
      <Route path="/admin/verification" element={<AdminRoute><VerificationPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
      <Route path="/admin/features" element={<AdminRoute><FeaturesPage /></AdminRoute>} />
      <Route path="/admin/forge" element={<AdminRoute><ForgePage /></AdminRoute>} />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <SocketProvider>
              <NotificationProvider>
                <OfflineProvider>
                  <NativeSetup />
                  <OfflineBanner />
                  <AppContent />
                  <NotificationContainer />
                </OfflineProvider>
              </NotificationProvider>
            </SocketProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

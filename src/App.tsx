import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CausesPage from "./pages/Causes";
import CauseDetailsPage from "./pages/CauseDetails";
import CauseDetail from "./pages/CauseDetail";
import SponsorFormPage from "./pages/SponsorForm";
import SponsorshipConfirmation from "./pages/SponsorshipConfirmation";
import LoginPage from "./pages/Login";
import CreateCausePage from "./pages/CreateCause";

// Public Pages
import WhySponsorPage from "./pages/WhySponsor";
import WhyClaimPage from "./pages/WhyClaim";

// Claimer Journey Pages
import ClaimFormPage from "./pages/claimer/ClaimForm";
import OtpVerificationPage from "./pages/claimer/OtpVerification";
import ClaimConfirmedPage from "./pages/claimer/ClaimConfirmed";
import ClaimStatusPage from "./pages/claimer/ClaimStatus";
import JoinWaitlistPage from "./pages/claimer/JoinWaitlist";
import WaitlistConfirmationPage from "./pages/claimer/WaitlistConfirmation";
import MagicLinkClaimPage from "./pages/claimer/MagicLinkClaim";
import WaitlistEmailPreviewPage from "./pages/claimer/WaitlistEmailPreview";

// Dashboard Pages
import SponsorDashboard from "./pages/dashboard/SponsorDashboard";
import ClaimerDashboard from "./pages/dashboard/ClaimerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Admin Pages
import CausesManagement from "./pages/admin/CausesManagement";
import CampaignApprovals from "./pages/admin/CampaignApprovals";
import LogoReview from "./pages/admin/LogoReview";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import Shipping from "./pages/admin/Shipping";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import QrScanner from "./pages/admin/QrScanner";
import ClaimDetails from '@/pages/admin/claims/ClaimDetails';
import CauseEdit from "./pages/admin/CauseEdit";

// Create QueryClient once, outside of component
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/causes" element={<CausesPage />} />
                <Route path="/cause/:id" element={<CauseDetailsPage />} />
                <Route path="/create-cause" element={<CreateCausePage />} />
                <Route path="/sponsor/new" element={<SponsorFormPage />} />
                <Route path="/sponsorship/confirmation" element={<SponsorshipConfirmation />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Public Information Pages */}
                <Route path="/why-sponsor" element={<WhySponsorPage />} />
                <Route path="/why-claim" element={<WhyClaimPage />} />
                
                {/* Claimer Journey Routes */}
                {/* Fix route ordering - more specific routes must come before dynamic routes */}
                <Route path="/claim/verify" element={<OtpVerificationPage />} />
                <Route path="/claim/confirmed" element={<ClaimConfirmedPage />} />
                <Route path="/claim/magic-link" element={<MagicLinkClaimPage />} />
                <Route path="/claim/status/:id" element={<ClaimStatusPage />} />
                <Route path="/claim/:id" element={<ClaimFormPage />} />
                <Route path="/waitlist/:id" element={<JoinWaitlistPage />} />
                <Route path="/waitlist/confirmed" element={<WaitlistConfirmationPage />} />
                <Route path="/claim/magic-link" element={<MagicLinkClaimPage />} />
                <Route path="/demo/waitlist-email" element={<WaitlistEmailPreviewPage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard/sponsor" element={
                  <ProtectedRoute allowedRoles={['sponsor', 'admin']}>
                    <SponsorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/claimer" element={
                  <ProtectedRoute allowedRoles={['claimer', 'admin']}>
                    <ClaimerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Unauthorized Route */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Redirect old visitor dashboard to appropriate dashboard */}
                <Route path="/dashboard/visitor" element={<Navigate to="/dashboard/claimer" replace />} />
                
                {/* Admin Routes */}
                <Route path="/admin/causes" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CausesManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/causes/:id" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CauseEdit />
                  </ProtectedRoute>
                } />
                <Route path="/admin/approvals" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CampaignApprovals />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logos" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <LogoReview />
                  </ProtectedRoute>
                } />
                <Route path="/admin/claims" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ClaimsManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/shipping" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Shipping />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/qr-scanner" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <QrScanner />
                  </ProtectedRoute>
                } />
                <Route path="/admin/claims/:id" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ClaimDetails />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

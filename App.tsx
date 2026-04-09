import { Navigation } from "./src/components/Navigation";
import { Footer } from "./src/components/Footer";
import CreateJob from "./src/admin/CreateJob";

import { HomePage } from "./src/pages/HomePage";
import { PortfolioPage } from "./src/pages/PortfolioPage";
import { ServicesPage } from "./src/pages/ServicesPage";
import { AboutPage } from "./src/pages/AboutPage";
import { BookingPage } from "./src/pages/BookingPage";
import { FeedbackPage } from "./src/pages/FeedbackPage";
import { ContactPage } from "./src/pages/ContactPage";
import { CareersPage } from "./src/pages/CareersPage";
import { Routes, Route, useLocation } from "react-router-dom";

import { Component, ErrorInfo, ReactNode } from "react";


import AdminAuthGuard from "./src/admin/AdminAuthGuard";
import AdminLayout from "./src/admin/AdminLayout";
import AdminDashboard from "./src/admin/AdminDashboard";
import AdminBookings from "./src/admin/AdminBookings";
import AdminApplications from "./src/admin/AdminApplications";
import AdminJobsList from "./src/admin/AdminJobsList";
import AdminContactMessages from "./src/admin/AdminContactMessages";

import EditJob from "./src/admin/EditJob";
/* ---------------- ERROR BOUNDARY ---------------- */

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl text-red-500 mb-4">
              Something went wrong.
            </h1>
            <pre className="bg-black/50 p-4 rounded text-sm overflow-auto text-red-200">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-6 px-6 py-3 bg-[#FDB913] text-[#0A1628] font-bold uppercase"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ---------------- APP CONTENT ---------------- */
function AppContent() {
  const location = useLocation();
    const SHOW_BOOKING_PAGE = false; 

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hide nav on admin pages */}
      {!isAdminPage && (
        <Navigation />
      )}

      <main className="min-h-screen pt-16">
        {/* ALL ROUTES */}
       <Routes>
  {/* ADMIN ROUTES — PROTECTED */}
  <Route
    path="/admin"
    element={
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="create-job" element={<CreateJob />} />
    <Route path="jobs" element={<AdminJobsList />} />
    <Route path="jobs/:id/edit" element={<EditJob />} />
    <Route path="bookings" element={<AdminBookings />} />
    <Route path="applications" element={<AdminApplications />} />
    <Route path="contact-messages" element={<AdminContactMessages />} />

  </Route>

  {/* PUBLIC ROUTES */}
  <Route path="/" element={<HomePage />} />
  <Route path="/portfolio" element={<PortfolioPage />} />
  <Route path="/services" element={<ServicesPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/careers" element={<CareersPage />} />
  {SHOW_BOOKING_PAGE && (
  <Route path="/book-session" element={<BookingPage />} />
)}

  <Route path="/contact" element={<ContactPage />} />
  <Route path="/feedback" element={<FeedbackPage />} />
</Routes>
      </main>

      {/* Hide footer on admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

/* ---------------- ROOT ---------------- */

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

import { useState } from "react";
import { Navigation } from "./src/components/Navigation";
import { Footer } from "./src/components/Footer";
import CreateJob from "./src/pages/careers/CreateJob";

import { HomePage } from "./src/pages/HomePage";
import { PortfolioPage } from "./src/pages/PortfolioPage";
import { ServicesPage } from "./src/pages/ServicesPage";
import { AboutPage } from "./src/pages/AboutPage";
import { BookingPage } from "./src/pages/BookingPage";
import { FeedbackPage } from "./src/pages/FeedbackPage";
import { ContactPage } from "./src/pages/ContactPage";
import { CareersPage } from "./src/pages/CareersPage";

import { Component, ErrorInfo, ReactNode } from "react";

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
  const [currentPage, setCurrentPage] = useState("home");

  //  detect hidden admin page
  const isAdminCreateJobPage =
    window.location.pathname === "/careers/create-job";

  const renderPage = () => {
    if (isAdminCreateJobPage) {
      return <CreateJob />;
    }

    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "portfolio":
        return <PortfolioPage />;
      case "services":
        return <ServicesPage />;
      case "about":
        return <AboutPage />;
      case "booking":
        return <BookingPage />;
      case "feedback":
        return <FeedbackPage />;
      case "careers":
        return <CareersPage />
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/*  hide nav on admin page */}
      {!isAdminCreateJobPage && (
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      )}

      <main className="min-h-screen pt-16">{renderPage()}</main>

      {/*  hide footer on admin page */}
      {!isAdminCreateJobPage && (
        <Footer onNavigate={setCurrentPage} />
      )}
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

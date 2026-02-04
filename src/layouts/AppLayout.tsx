import { ReactNode, useState } from "react";
import { Navigation } from "../components/Navigation";
import { useNavigate, useLocation } from "react-router-dom";

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // derive page name from URL
  const currentPage =
    location.pathname === "/" ? "home" : location.pathname.replace("/", "");

  const handleNavigate = (page: string) => {
    if (page === "home") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main>{children}</main>
    </div>
  );
}

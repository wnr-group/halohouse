import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/sonner";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5E8D8] p-8">
      <Toaster position="top-right" />

      {/* Admin child pages render here */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
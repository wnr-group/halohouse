import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5E8D8] p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Admin child pages render here */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;

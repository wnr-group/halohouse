import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5E8D8] p-8">
   

      {/* Admin child pages render here */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;

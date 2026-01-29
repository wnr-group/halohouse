import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="space-y-3">
        <Link to="/admin/create-job" className="block underline">
          ➜ Create Job
        </Link>

        <Link to="/admin/bookings" className="block underline">
          ➜ View Booking Sessions
        </Link>

        <Link to="/admin/applications" className="block underline">
          ➜ View Job Applications
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

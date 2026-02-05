import { supabase } from "@/lib/supabase";
import { useState } from "react";

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const response = await supabase.functions.invoke("login", {
        body: { password: password.trim() },
      });

      if (response.data["success"]) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D8]">
        <div className="max-w-md w-full p-8">
          <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
          <p className="mb-6 text-sm opacity-70">
            Authenticate to access admin panel
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault(); // prevent page reload
              await handleLogin();
            }}
          >
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-3 mb-4"
            />

            <button type="submit" className="w-full bg-black text-white py-3">
              Login
            </button>
          </form>
          {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;

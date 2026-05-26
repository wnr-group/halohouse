import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError("Incorrect email or password");
    } else {
      setError("");
    }
  };

  if (loading) return null;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E8D8]">
        <div className="max-w-md w-full p-8">
          <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
          <p className="mb-6 text-sm opacity-70">
            Authenticate to access admin panel
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleLogin();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-3 mb-4"
            />
            <input
              type="password"
              placeholder="Password"
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

  return (
    <>
      <div className="flex justify-end px-8 pt-4">
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm opacity-60 hover:opacity-100 underline"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
};

export default AdminAuthGuard;

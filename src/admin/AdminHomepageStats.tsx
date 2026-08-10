import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const ICON_OPTIONS = ["users", "video", "briefcase"];

const AdminHomepageStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("homepage_stats")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFieldChange = (id: string, field: string, value: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (stat: any) => {
    setSavingId(stat.id);

    const { error } = await supabase
      .from("homepage_stats")
      .update({
        icon_key: stat.icon_key,
        value: stat.value,
        label: stat.label,
      })
      .eq("id", stat.id);

    if (error) {
      alert("Failed to save stat");
      setSavingId(null);
      return;
    }

    toast.success("Stat updated successfully");
    setSavingId(null);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Key Stats</h1>
      <p className="text-sm opacity-70 mb-8">
        Edits the three stat cards shown on the homepage.
      </p>

      {loading && <p className="opacity-60">Loading...</p>}

      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.id} className="border border-black/20 p-4 space-y-3">
            <div>
              <label className="font-medium block mb-1">Icon</label>
              <select
                value={stat.icon_key}
                onChange={(e) => handleFieldChange(stat.id, "icon_key", e.target.value)}
                className="w-full border px-4 py-2"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium block mb-1">Value</label>
              <input
                value={stat.value}
                onChange={(e) => handleFieldChange(stat.id, "value", e.target.value)}
                className="w-full border px-4 py-2"
                placeholder="20+"
              />
            </div>

            <div>
              <label className="font-medium block mb-1">Label</label>
              <input
                value={stat.label}
                onChange={(e) => handleFieldChange(stat.id, "label", e.target.value)}
                className="w-full border px-4 py-2"
                placeholder="Clients"
              />
            </div>

            <button
              onClick={() => handleSave(stat)}
              disabled={savingId === stat.id}
              className="bg-black text-white px-6 py-2 disabled:opacity-50"
            >
              {savingId === stat.id ? "Saving..." : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepageStats;
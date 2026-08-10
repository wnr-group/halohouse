import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const AdminSiteSettings = () => {
  const [form, setForm] = useState({
    phone: "",
    whatsapp_number: "",
    email: "",
    address: "",
    instagram_url: "",
    youtube_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [extraLinks, setExtraLinks] = useState<any[]>([]);
  const [savingLinkId, setSavingLinkId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [addingLink, setAddingLink] = useState(false);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) setForm((prev) => ({ ...prev, ...data }));
    setLoading(false);
  };

  const fetchExtraLinks = async () => {
    const { data, error } = await supabase
      .from("site_extra_links")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) setExtraLinks(data);
  };

  useEffect(() => {
    fetchSettings();
    fetchExtraLinks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...form, updated_at: new Date().toISOString() });

    if (error) {
      alert("Failed to save settings");
      setSaving(false);
      return;
    }

    toast.success("Site settings updated successfully");
    setSaving(false);
  };

  const handleExtraLinkFieldChange = (id: string, field: string, value: string) => {
    setExtraLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const handleSaveExtraLink = async (link: any) => {
    setSavingLinkId(link.id);

    const { error } = await supabase
      .from("site_extra_links")
      .update({ label: link.label, url: link.url })
      .eq("id", link.id);

    if (error) {
      alert("Failed to save link");
      setSavingLinkId(null);
      return;
    }

    toast.success("Link saved successfully");
    setSavingLinkId(null);
  };

  const handleAddExtraLink = async () => {
    setAddingLink(true);

    const { data, error } = await supabase
      .from("site_extra_links")
      .insert([{ label: "", url: "", sort_order: extraLinks.length + 1 }])
      .select()
      .single();

    if (error || !data) {
      alert("Failed to add link");
      setAddingLink(false);
      return;
    }

    setExtraLinks((prev) => [...prev, data]);
    setAddingLink(false);
  };

  const handleDeleteExtraLink = async (id: string) => {
    if (!confirm("Remove this link?")) return;

    setDeletingLinkId(id);

    const { error } = await supabase.from("site_extra_links").delete().eq("id", id);

    if (error) {
      alert("Failed to remove link");
      setDeletingLinkId(null);
      return;
    }

    setExtraLinks((prev) => prev.filter((link) => link.id !== id));
    setDeletingLinkId(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="opacity-60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <div className="space-y-6">
        <div>
          <label className="font-medium block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="+91 8754706742"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">WhatsApp Number</label>
          <input
            name="whatsapp_number"
            value={form.whatsapp_number}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="+917010017080"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="Studio address"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Instagram URL</label>
          <input
            name="instagram_url"
            value={form.instagram_url}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="https://www.instagram.com/..."
          />
        </div>

        <div>
          <label className="font-medium block mb-1">YouTube URL</label>
          <input
            name="youtube_url"
            value={form.youtube_url}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="https://www.youtube.com/..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-3 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Additional links — independent from Instagram/YouTube above */}
      <div className="border-t mt-10 pt-6">
        <h2 className="text-xl font-bold mb-1">Additional Links</h2>
        <p className="text-sm opacity-70 mb-4">
          Add any other site/social links beyond Instagram and YouTube.
        </p>

        <div className="space-y-4">
          {extraLinks.map((link) => (
            <div key={link.id} className="border border-black/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide opacity-60">
                  {link.label ? `${link.label} (Additional)` : "New Link (Additional)"}
                </span>
                <button
                  onClick={() => handleDeleteExtraLink(link.id)}
                  disabled={deletingLinkId === link.id}
                  className="text-red-700 disabled:opacity-50"
                  aria-label="Remove link"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <label className="font-medium block mb-1 text-sm">Label</label>
                <input
                  value={link.label}
                  onChange={(e) =>
                    handleExtraLinkFieldChange(link.id, "label", e.target.value)
                  }
                  className="w-full border px-4 py-2"
                  placeholder="e.g. LinkedIn"
                />
              </div>

              <div>
                <label className="font-medium block mb-1 text-sm">URL</label>
                <input
                  value={link.url}
                  onChange={(e) =>
                    handleExtraLinkFieldChange(link.id, "url", e.target.value)
                  }
                  className="w-full border px-4 py-2"
                  placeholder="https://..."
                />
              </div>

              <button
                onClick={() => handleSaveExtraLink(link)}
                disabled={savingLinkId === link.id}
                className="bg-black text-white px-6 py-2 disabled:opacity-50"
              >
                {savingLinkId === link.id ? "Saving..." : "Save"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddExtraLink}
          disabled={addingLink}
          className="underline font-medium mt-4 disabled:opacity-50"
        >
          {addingLink ? "Adding..." : "➜ Add Link"}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
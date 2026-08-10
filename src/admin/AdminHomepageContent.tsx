import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const AdminHomepageContent = () => {
  const [form, setForm] = useState({
    hero_line1: "",
    hero_line2_prefix: "",
    hero_highlight: "",
    hero_description: "",
    hero_button_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) setForm((prev) => ({ ...prev, ...data }));
      setLoading(false);
    };

    fetchContent();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("homepage_content")
      .upsert({ id: 1, ...form, updated_at: new Date().toISOString() });

    if (error) {
      alert("Failed to save homepage content");
      setSaving(false);
      return;
    }

    toast.success("Homepage content updated successfully");
    setSaving(false);
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
      <h1 className="text-3xl font-bold mb-2">Homepage Hero Content</h1>
      <p className="text-sm opacity-70 mb-8">
        Edits the main heading, description, and button on the homepage hero
        section. The camera-scroll section below it is not editable here.
      </p>

      <div className="space-y-6">
        <div>
          <label className="font-medium block mb-1">Heading Line 1</label>
          <input
            name="hero_line1"
            value={form.hero_line1}
            onChange={handleChange}
            maxLength={40}
            className="w-full border px-4 py-2"
            placeholder="Step Into"
          />
          <p className="text-xs opacity-60 mt-1">{form.hero_line1.length}/40</p>
        </div>

        <div>
          <label className="font-medium block mb-1">Heading Line 2 — Prefix word</label>
          <input
            name="hero_line2_prefix"
            value={form.hero_line2_prefix}
            onChange={handleChange}
            maxLength={40}
            className="w-full border px-4 py-2"
            placeholder="Your"
          />
          <p className="text-xs opacity-60 mt-1">{form.hero_line2_prefix.length}/40</p>
        </div>

        <div>
          <label className="font-medium block mb-1">Heading Line 2 — Highlighted word</label>
          <input
            name="hero_highlight"
            value={form.hero_highlight}
            onChange={handleChange}
            maxLength={40}
            className="w-full border px-4 py-2"
            placeholder="Spotlight"
          />
          <p className="text-xs opacity-60 mt-1">{form.hero_highlight.length}/40</p>
        </div>

        <div>
          <label className="font-medium block mb-1">Description</label>
          <textarea
            name="hero_description"
            value={form.hero_description}
            onChange={handleChange}
            maxLength={220}
            rows={4}
            className="w-full border px-4 py-2"
          />
          <p className="text-xs opacity-60 mt-1">{form.hero_description.length}/220</p>
        </div>

        <div>
          <label className="font-medium block mb-1">Button Text</label>
          <input
            name="hero_button_text"
            value={form.hero_button_text}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            placeholder="Book Your Session"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-3 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>
    </div>
  );
};

export default AdminHomepageContent;
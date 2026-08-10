import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import {
  getFriendlyUploadErrorMessage,
  MAX_VIDEO_SIZE_MB,
  uploadVideoWithPoster,
} from "../lib/videoUpload";

const CATEGORIES = ["Commercial", "Reels", "Studio"];

// Same gradient palette used by the existing portfolio items, cycled
// automatically so new cards look consistent without manual input.
const BG_OPTIONS = [
  "from-yellow-950 to-amber-900",
  "from-sky-950 to-blue-900",
  "from-violet-950 to-purple-900",
  "from-rose-950 to-pink-900",
  "from-slate-950 to-slate-800",
  "from-stone-950 to-amber-950",
  "from-green-950 to-emerald-900",
  "from-orange-950 to-red-900",
  "from-blue-950 to-indigo-900",
];

const CreatePortfolioVideo = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
   if (!title.trim() || !file) {
      setError("Title and a video file are required");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setError(`Video size must be less than ${MAX_VIDEO_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const { filePath, posterPath } = await uploadVideoWithPoster("portfolio", file);

      const { count } = await supabase
        .from("portfolio_videos")
        .select("*", { count: "exact", head: true });

      const nextOrder = (count || 0) + 1;
      const bg = BG_OPTIONS[(count || 0) % BG_OPTIONS.length];

      const { error: insertError } = await supabase.from("portfolio_videos").insert([
        {
          title: title.trim(),
          category,
          file_path: filePath,
          poster_path: posterPath,
          bg,
          sort_order: nextOrder,
        },
      ]);

      if (insertError) throw insertError;

      toast.success("Portfolio video uploaded successfully");
      navigate("/admin/videos");
    } catch (err) {
      console.error(err);
      setError(getFriendlyUploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E8D8] p-12">
      <h1 className="text-4xl font-bold mb-8">Add Portfolio Video</h1>

      <div className="max-w-3xl space-y-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2"
          placeholder="Video Title"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-4 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div>
          <label className="font-medium block mb-2">Video file</label>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border px-4 py-2"
          />
          <p className="text-xs opacity-60 mt-1">
            .mp4 is recommended — automatic thumbnail generation is most reliable
            with that format. Max file size: {MAX_VIDEO_SIZE_MB} MB.
          </p>
        </div>

        {error && <p className="text-red-700 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-black text-white px-6 py-3 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Add Video"}
        </button>
      </div>
    </div>
  );
};

export default CreatePortfolioVideo;
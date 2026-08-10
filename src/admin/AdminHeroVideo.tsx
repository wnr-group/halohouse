import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  getFriendlyUploadErrorMessage,
  MAX_VIDEO_SIZE_MB,
  removeVideoFiles,
  uploadVideoWithPoster,
  videoPublicUrl,
} from "../lib/videoUpload";

const AdminHeroVideo = () => {
  const [current, setCurrent] = useState<{ file_path: string; poster_path: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchHeroVideo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_video")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setCurrent(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHeroVideo();
  }, []);

  const handleReplace = async () => {
    if (!file) {
      setError("Please choose a video file first");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setError(`Video size must be less than ${MAX_VIDEO_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const { filePath, posterPath } = await uploadVideoWithPoster("hero", file);
      const previousFilePath = current?.file_path;
      const previousPosterPath = current?.poster_path;

      const { error: upsertError } = await supabase
        .from("hero_video")
        .upsert({ id: 1, file_path: filePath, poster_path: posterPath, updated_at: new Date().toISOString() });

      if (upsertError) throw upsertError;

      // Only remove the old files once the new row is confirmed saved.
      if (previousFilePath) {
        await removeVideoFiles([previousFilePath, previousPosterPath]);
      }

      toast.success("Hero video updated successfully");
      setFile(null);
      await fetchHeroVideo();
    } catch (err) {
      console.error(err);
      setError(getFriendlyUploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Manage Hero Video</h1>
      <p className="text-sm opacity-70 mb-6">
        This is the single video shown at the top of the homepage. Uploading a
        new file replaces it everywhere immediately.
      </p>

      {loading && <p className="opacity-60">Loading...</p>}

      {!loading && current && (
        <div className="mb-8">
          <p className="font-medium mb-2">Current hero video</p>
          <video
            src={videoPublicUrl(current.file_path)}
            poster={current.poster_path ? videoPublicUrl(current.poster_path) : undefined}
            muted
            playsInline
            preload="metadata"
            controls
            className="w-full aspect-video bg-black/10 rounded"
          />
        </div>
      )}

      <div className="border border-black/20 p-4 space-y-4">
        <label className="font-medium block">Replace with new video</label>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border px-4 py-2"
        />
       <p className="text-xs opacity-60">
          .mp4 is recommended — automatic thumbnail generation is most reliable
          with that format. Max file size: {MAX_VIDEO_SIZE_MB} MB.
        </p>

        {error && <p className="text-red-700 text-sm">{error}</p>}

        <button
          onClick={handleReplace}
          disabled={uploading}
          className="bg-black text-white px-6 py-3 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Replace Hero Video"}
        </button>
      </div>
    </div>
  );
};

export default AdminHeroVideo;
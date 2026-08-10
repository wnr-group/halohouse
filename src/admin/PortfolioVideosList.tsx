import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { generatePosterForExistingVideo, removeVideoFiles, videoPublicUrl } from "../lib/videoUpload";

const PortfolioVideosList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching portfolio videos:", error);
      setLoading(false);
      return;
    }

    setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (video: any) => {
    if (!confirm(`Delete "${video.title}"? This cannot be undone.`)) return;

    setDeletingId(video.id);

    const { error } = await supabase
      .from("portfolio_videos")
      .delete()
      .eq("id", video.id);

    if (error) {
      alert("Failed to delete video");
      setDeletingId(null);
      return;
    }

    await removeVideoFiles([video.file_path, video.poster_path]);

    setVideos((prev) => prev.filter((v) => v.id !== video.id));
    setDeletingId(null);
  };

  const handleGenerateThumbnail = async (video: any) => {
    setGeneratingId(video.id);

    const posterPath = await generatePosterForExistingVideo(video);

    if (!posterPath) {
      alert("Could not generate a thumbnail for this video. Please try again.");
      setGeneratingId(null);
      return;
    }

    const { error } = await supabase
      .from("portfolio_videos")
      .update({ poster_path: posterPath })
      .eq("id", video.id);

    if (error) {
      alert("Thumbnail was generated but could not be saved. Please try again.");
      setGeneratingId(null);
      return;
    }

    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, poster_path: posterPath } : v))
    );
    setGeneratingId(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Portfolio Videos</h1>
        <Link
          to="/admin/videos/new"
          className="underline font-medium"
        >
          ➜ Add Video
        </Link>
      </div>

      {loading && <p className="opacity-60">Loading...</p>}

      {!loading && videos.length === 0 && (
        <p className="opacity-60">No portfolio videos found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border border-black/20 p-4 space-y-3"
          >
            <div className="aspect-video bg-black/10 overflow-hidden rounded">
              <video
                src={videoPublicUrl(video.file_path)}
                poster={video.poster_path ? videoPublicUrl(video.poster_path) : undefined}
                muted
                playsInline
                preload="metadata"
                controls
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm opacity-70">{video.category}</p>
            </div>

            <div className="flex items-center gap-4">
              {!video.poster_path && (
                <button
                  onClick={() => handleGenerateThumbnail(video)}
                  disabled={generatingId === video.id}
                  className="text-sm underline font-medium disabled:opacity-50"
                >
                  {generatingId === video.id ? "Generating..." : "Generate Thumbnail"}
                </button>
              )}

              <button
                onClick={() => handleDelete(video)}
                disabled={deletingId === video.id}
                className="text-sm underline font-medium text-red-700 disabled:opacity-50"
              >
                {deletingId === video.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioVideosList;
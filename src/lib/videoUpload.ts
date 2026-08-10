import { supabase } from "./supabase";

const BUCKET = "portfolio-videos";

// Must match the "portfolio-videos" bucket's file_size_limit
// (see supabase/migrations/20260531000001_storage_portfolio_videos.sql).
export const MAX_VIDEO_SIZE_BYTES = 52428800; // 50 MB
export const MAX_VIDEO_SIZE_MB = MAX_VIDEO_SIZE_BYTES / (1024 * 1024);

/**
 * Maps a caught upload/download error to a short, user-friendly message.
 * Falls back to a generic message for anything unrecognized.
 */
export function getFriendlyUploadErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();

  if (
    lower.includes("exceeded the maximum allowed size") ||
    lower.includes("payload too large") ||
    lower.includes("413")
  ) {
    return `Video size must be less than ${MAX_VIDEO_SIZE_MB} MB.`;
  }

  if (lower.includes("mime type") || lower.includes("not supported")) {
    return "This file type isn't supported. Please upload an MP4, MOV, or WebM video.";
  }

  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Network error while uploading. Please check your connection and try again.";
  }

  if (lower.includes("duplicate") || lower.includes("already exists")) {
    return "A file with this name already exists. Please try again.";
  }

  return "Failed to upload video. Please try again.";
}

/**
 * Best-effort poster frame capture. Runs entirely client-side against a
 * local object URL of the given file/blob — never touches the network.
 * Returns null (never throws) if the browser can't decode the format,
 * so callers can safely continue regardless of outcome.
 */
function capturePosterFrame(file: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    const finish = (result: Blob | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    // Don't let an unsupported/slow format hang the upload flow.
    const timeout = setTimeout(() => finish(null), 4000);

    video.addEventListener("loadeddata", () => {
      // Seek slightly in so we don't capture a black/blank first frame.
      try {
        video.currentTime = Math.min(0.5, video.duration / 2 || 0);
      } catch {
        finish(null);
      }
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx || !canvas.width || !canvas.height) {
          finish(null);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            clearTimeout(timeout);
            finish(blob);
          },
          "image/jpeg",
          0.8
        );
      } catch {
        finish(null);
      }
    });

    video.addEventListener("error", () => finish(null));

    video.src = objectUrl;
  });
}

function extForName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

/**
 * Uploads a video file (and, if capture succeeds, a matching poster image)
 * into the shared "portfolio-videos" bucket under the given folder.
 * Poster capture failure never blocks or fails the video upload.
 */
export async function uploadVideoWithPoster(
  folder: "portfolio" | "hero",
  videoFile: File
): Promise<{ filePath: string; posterPath: string | null }> {
  const stamp = Date.now();
  const safeExt = extForName(videoFile.name) || ".mp4";
  const videoPath = `${folder}/${stamp}${safeExt}`;

  const { error: videoUploadError } = await supabase.storage
    .from(BUCKET)
    .upload(videoPath, videoFile, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (videoUploadError) throw videoUploadError;

  let posterPath: string | null = null;
  const posterBlob = await capturePosterFrame(videoFile);

  if (posterBlob) {
    const candidatePath = `${folder}/${stamp}-poster.jpg`;
    const { error: posterUploadError } = await supabase.storage
      .from(BUCKET)
      .upload(candidatePath, posterBlob, {
        cacheControl: "31536000",
        upsert: false,
        contentType: "image/jpeg",
      });

    // Poster is a nice-to-have; if it fails to upload, keep going with null.
    if (!posterUploadError) {
      posterPath = candidatePath;
    }
  }

  return { filePath: videoPath, posterPath };
}

/**
 * Generates and uploads a poster for a video that's already in storage
 * (no re-upload of the video itself). Downloads the existing video as a
 * local Blob first (via the authenticated Supabase client) and reuses the
 * same local-blob capture path as new uploads — this avoids relying on
 * cross-origin <video> + canvas capture against the public URL, which
 * depends on the storage server's CORS/Range support and isn't reliable
 * across all environments (e.g. local/self-hosted Supabase).
 * Returns the new poster's storage path on success, or null on failure.
 */
export async function generatePosterForExistingVideo(video: {
  id: string;
  file_path: string;
}): Promise<string | null> {
  const { data: videoBlob, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(video.file_path);

  if (downloadError || !videoBlob) return null;

  const posterBlob = await capturePosterFrame(videoBlob);
  if (!posterBlob) return null;

  const posterPath = `portfolio/${video.id}-poster.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(posterPath, posterBlob, {
      cacheControl: "31536000",
      upsert: true,
      contentType: "image/jpeg",
    });

  if (uploadError) return null;
  return posterPath;
}

export async function removeVideoFiles(paths: (string | null | undefined)[]) {
  const toRemove = paths.filter((p): p is string => !!p);
  if (toRemove.length === 0) return;
  await supabase.storage.from(BUCKET).remove(toRemove);
}

export function videoPublicUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
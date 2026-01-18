// n8n Integration Utilities

export interface VideoGenerationRequest {
  prompt: string;
  style?: "cinematic" | "anime" | "realistic" | "cartoon" | "minimal";
  duration?: number;
  format?: "mp4" | "webm" | "gif";
  resolution?: "720p" | "1080p" | "4k";
}

export interface VideoGenerationResponse {
  success: boolean;
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  message?: string;
  videoUrl?: string;
  progress?: number;
}

/**
 * Trigger video generation via n8n webhook
 */
export async function generateVideo(
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  const response = await fetch("/api/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to start video generation");
  }

  return response.json();
}

/**
 * Check video generation status
 */
export async function checkVideoStatus(
  jobId: string
): Promise<VideoGenerationResponse> {
  const response = await fetch(`/api/webhook?jobId=${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to check video status");
  }

  return response.json();
}

/**
 * Poll for video completion
 */
export async function waitForVideoCompletion(
  jobId: string,
  onProgress?: (progress: number) => void,
  maxAttempts = 60,
  intervalMs = 2000
): Promise<VideoGenerationResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkVideoStatus(jobId);

    if (onProgress && status.progress) {
      onProgress(status.progress);
    }

    if (status.status === "completed") {
      return status;
    }

    if (status.status === "failed") {
      throw new Error(status.message || "Video generation failed");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Video generation timed out");
}

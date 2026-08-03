export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

/** Convert a backend image_path into a browser-reachable URL. */
export function resolveImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalized = imagePath.replace(/\\/g, "/");
  const marker = "/uploads/";
  const idx = normalized.toLowerCase().indexOf(marker);
  if (idx >= 0) {
    return `${API_URL}${normalized.slice(idx)}`;
  }

  // Paths like "uploads/temp/images/x.jpg" or absolute ".../uploads/..."
  if (normalized.includes("uploads/")) {
    const relative = normalized.slice(normalized.indexOf("uploads/"));
    return `${API_URL}/${relative}`;
  }

  return `${API_URL}/uploads/${normalized.replace(/^\/+/, "")}`;
}

export function severityVariant(
  severity?: string | null,
): "default" | "secondary" | "destructive" | "outline" {
  const value = (severity || "").toLowerCase();
  if (value === "critical" || value === "high") return "destructive";
  if (value === "moderate") return "secondary";
  if (value === "low" || value === "none") return "outline";
  return "default";
}

export const REPORT_DISCLAIMER =
  "This diagnostic report is generated using Artificial Intelligence for screening assistance only. The prediction may contain inaccuracies and should not be considered a final medical diagnosis. Please consult a qualified healthcare professional for clinical evaluation and confirmation.";

/**
 * AI engine returns confidence/probabilities as 0–100 percentages.
 * Older clients may still send 0–1 fractions — support both.
 */
export function toPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value <= 1 ? value * 100 : value;
}

export function formatConfidencePercent(confidence: number, decimals = 2): string {
  return `${toPercent(confidence).toFixed(decimals)}%`;
}

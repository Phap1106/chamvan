// src/lib/apiClient.ts
export function getApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE_URL ||
    "http://localhost:4000/api";

  return String(raw).replace(/\/+$/, "");
}

/**
 * Uploads có thể được serve từ:
 * - API domain (vd: http://localhost:4000 hoặc https://api.chamvan.com)
 * - hoặc chính FE origin (vd: http://localhost:3000) nếu bạn đang lưu uploads ở FE
 *
 * Ưu tiên:
 * 1) NEXT_PUBLIC_UPLOADS_ORIGIN (khuyến nghị)
 * 2) origin tách từ API base (/api -> origin)
 * 3) rỗng => giữ nguyên "/uploads/..." để browser load theo origin hiện tại
 */
export function getUploadsOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_UPLOADS_ORIGIN;
  if (explicit && String(explicit).trim()) return String(explicit).replace(/\/+$/, "");

  const apiBase = getApiBase();
  const b = apiBase.replace(/\/+$/, "");
  const origin = b.endsWith("/api") ? b.slice(0, -4) : b;
  return origin.replace(/\/+$/, "");
}

export function resolveImageUrl(input?: string | null): string {
  const s = String(input ?? "").trim();
  if (!s) return "/placeholder.jpg";

  // absolute / data
  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;

  // normalize "uploads/.." => "/uploads/.."
  const normalized = s.startsWith("uploads/") ? `/${s}` : s;

  // if "/uploads/.." => allow configurable origin
  if (normalized.startsWith("/uploads/")) {
    const upOrigin = getUploadsOrigin();
    // Nếu upOrigin rỗng => giữ nguyên "/uploads/..." (load theo FE origin hiện tại)
    return upOrigin ? `${upOrigin}${normalized}` : normalized;
  }

  // other root-relative
  if (normalized.startsWith("/")) return normalized;

  // fallback: make it root-relative
  return `/${normalized}`;
}

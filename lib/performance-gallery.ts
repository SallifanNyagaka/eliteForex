import type { PerformanceScreenshot } from "@/lib/cms-types";

export const PERFORMANCE_GALLERY_KEY = "performance_gallery";
export const PERFORMANCE_GALLERY_LIMIT = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizePerformanceGallery(payload: unknown): PerformanceScreenshot[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => {
      const image = isRecord(item.image) ? item.image : {};

      return {
        id: typeof item.id === "string" ? item.id : "",
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
        image: {
          url: typeof image.url === "string" ? image.url : "",
          alt: typeof image.alt === "string" ? image.alt : "",
        },
        storagePath: typeof item.storagePath === "string" ? item.storagePath : "",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
      };
    })
    .filter((item) => item.id && item.title && item.image.url)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, PERFORMANCE_GALLERY_LIMIT);
}

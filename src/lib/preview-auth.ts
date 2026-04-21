export const isLovablePreview = () => {
  if (typeof window === "undefined") return false;

  const { hostname } = window.location;

  return hostname.endsWith(".lovableproject.com") ||
    (hostname.endsWith(".lovable.app") && hostname.includes("--"));
};

export const getPreviewAdminUser = () => ({
  id: "lovable-preview-admin",
  email: "owner@lovable-preview.local",
});
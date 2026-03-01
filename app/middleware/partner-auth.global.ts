export default defineNuxtRouteMiddleware((to) => {
  const {
    canAccessPartnerDocs,
    isAuthenticated,
    canAccessSandboxDocs,
    canAccessApiReference,
    canAccessOperationalGuides,
    partnerStage,
  } = useAuth();

  // Helper to check if path starts with a prefix, accounting for locales
  const matchesPath = (path: string, prefix: string) => {
    const locales = ["en", "fr", "ar"];
    const cleanPath = path.replace(new RegExp(`^/(${locales.join("|")})`), "");
    return cleanPath.startsWith(prefix);
  };

  // Check if accessing partner documentation
  if (matchesPath(to.path, "/partners")) {
    if (!isAuthenticated.value) {
      // Redirect to login with return URL
      return navigateTo({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }

    if (!canAccessPartnerDocs.value) {
      // User is authenticated but not a partner
      return abortNavigation({
        statusCode: 403,
        message: "Access to partner documentation requires partner status",
      });
    }

    // Progressive disclosure based on partner stage
    // API Reference requires production access
    if (
      matchesPath(to.path, "/partners/api-reference") ||
      matchesPath(to.path, "/partners/4.api-reference")
    ) {
      if (!canAccessApiReference.value) {
        return abortNavigation({
          statusCode: 403,
          message: `API Reference documentation requires production access. Current stage: ${partnerStage.value || "sandbox"}. Contact your account manager to upgrade.`,
        });
      }
    }

    // Operational Guides require pre-production or live stage
    if (
      matchesPath(to.path, "/partners/operational-guides") ||
      matchesPath(to.path, "/partners/5.operational-guides")
    ) {
      if (!canAccessOperationalGuides.value) {
        return abortNavigation({
          statusCode: 403,
          message: `Operational Guides require pre-production or live partner status. Current stage: ${partnerStage.value || "sandbox"}.`,
        });
      }
    }

    // Sandbox docs require at least sandbox access
    if (
      matchesPath(to.path, "/partners/sandbox") ||
      matchesPath(to.path, "/partners/3.environments/2.sandbox") ||
      matchesPath(to.path, "/partners/4.sandbox")
    ) {
      if (!canAccessSandboxDocs.value) {
        return abortNavigation({
          statusCode: 403,
          message: "Sandbox documentation requires sandbox access.",
        });
      }
    }
  }
});

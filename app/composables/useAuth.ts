import type {
  User,
  AuthState,
  PartnerStage,
  PartnerAccessLevel,
} from "~/types/auth";

export const useAuth = () => {
  const config = useRuntimeConfig();

  // State
  const user = useState<User | null>("auth:user", () => null);

  // Token Cookie (Managed by JS, sent as Authorization header)
  const token = useCookie("partner_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    watch: true,
  });

  /**
   * Set authentication token
   */
  const setToken = (newToken: string | null, remember: boolean = false) => {
    token.value = newToken;

    // Update cookie options based on remember me
    const cookieOptions = {
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      watch: true,
    };

    // Re-initialize the cookie with new options to update maxAge
    const newCookie = useCookie("partner_token", cookieOptions);
    newCookie.value = newToken;
  };

  /**
   * Set user data
   */
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const isPartner = computed(() => user.value?.isPartner ?? false);
  const isInternal = computed(() => user.value?.isInternal ?? false);

  const hasRole = (role: string): boolean => {
    if (!user.value) return false;
    return user.value.roles.includes(role as any);
  };

  /**
   * Determine partner stage from user data
   */
  const determinePartnerStage = (userData: any): PartnerStage | undefined => {
    if (!userData?.partner) return undefined;

    // Check for explicit stage from backend
    if (userData.partner.stage) {
      return userData.partner.stage as PartnerStage;
    }

    // Infer stage from partner data
    const hasProductionAccess = userData.partner.has_production_access ?? false;
    const hasSandboxAccess = userData.partner.has_sandbox_access ?? true; // Default to sandbox
    const isApproved = userData.partner.is_approved ?? false;

    if (hasProductionAccess && isApproved) {
      return "live";
    } else if (isApproved && !hasProductionAccess) {
      return "pre-production";
    } else if (hasSandboxAccess) {
      return "sandbox";
    }

    return "discovery";
  };

  /**
   * Computed properties for access levels
   */
  const hasSandboxAccess = computed(() => {
    if (isInternal.value) return true;
    if (!isPartner.value) return false;
    return user.value?.hasSandboxAccess ?? false;
  });

  const hasProductionAccess = computed(() => {
    if (isInternal.value) return true;
    if (!isPartner.value) return false;
    return user.value?.hasProductionAccess ?? false;
  });

  const partnerStage = computed(() => user.value?.partnerStage);

  /**
   * Granular access control
   */
  const canAccessPartnerDocs = computed(() => {
    return true; // Public access
  });

  const canAccessInternalDocs = computed(() => {
    return isInternal.value;
  });

  const canAccessSandboxDocs = computed(() => {
    return true; // Public access
  });

  const canAccessProductionDocs = computed(() => {
    return true; // Public access
  });

  const canAccessApiReference = computed(() => {
    return true; // Public access
  });

  const canAccessOperationalGuides = computed(() => {
    return true; // Public access
  });

  /**
   * Get access level summary
   */
  const getAccessLevel = computed((): PartnerAccessLevel => {
    return {
      canAccessSandboxDocs: canAccessSandboxDocs.value,
      canAccessProductionDocs: canAccessProductionDocs.value,
      canAccessApiReference: canAccessApiReference.value,
      canAccessOperationalGuides: canAccessOperationalGuides.value,
    };
  });

  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig();

    try {
      const response = await $fetch<{ user: User; token: string }>(
        `${config.public.apiBase}/api/v1/auth/login`,
        {
          method: "POST",
          body: { email, password },
        },
      );

      user.value = response.user;
      token.value = response.token;

      // Store token in cookie for persistence
      const tokenCookie = useCookie("partner_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: "strict",
      });
      tokenCookie.value = response.token;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Authentication failed",
      };
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await $fetch(`${config.public.apiBase}/api/v1/partner/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      user.value = null;

      // Explicitly delete the cookie by setting it to null
      token.value = null;

      // Also create a new cookie ref with maxAge -1 to force deletion
      const deleteCookie = useCookie("partner_token", {
        maxAge: -1,
        path: "/",
      });
      deleteCookie.value = null;

      // Navigate to login page
      await navigateTo("/login", { replace: true });
    }
  };

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null;
      return;
    }

    try {
      const data = await $fetch<any>(
        `${config.public.apiBase}/api/v1/partner/user`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          credentials: "include",
        },
      );

      // Map the partner portal user to our auth user format
      const partnerStage = determinePartnerStage(data);
      const hasSandbox = data.partner?.has_sandbox_access ?? true;
      const hasProduction = data.partner?.has_production_access ?? false;

      // Determine roles based on access levels
      const roles: any[] = [];
      if (data.partner) {
        if (hasSandbox) roles.push("partner:sandbox");
        if (hasProduction) roles.push("partner:production");
      }

      user.value = {
        id: data.id,
        email: data.email,
        name: data.name,
        roles,
        isPartner: !!data.partner,
        isInternal:
          data.roles?.some((r: any) =>
            ["super_admin", "admin"].includes(r.name),
          ) ?? false,
        partnerTier: data.partner?.tier || "starter",
        partnerStage,
        hasSandboxAccess: hasSandbox,
        hasProductionAccess: hasProduction,
      };
    } catch (error) {
      console.error("Failed to fetch user:", error);
      token.value = null;
      user.value = null;
    }
  };

  /**
   * Initialize auth state on app load
   */
  const initAuth = async () => {
    if (token.value && !user.value) {
      await fetchUser();
    }
  };

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isPartner,
    isInternal,
    hasRole,
    hasSandboxAccess,
    hasProductionAccess,
    partnerStage,
    canAccessPartnerDocs,
    canAccessInternalDocs,
    canAccessSandboxDocs,
    canAccessProductionDocs,
    canAccessApiReference,
    canAccessOperationalGuides,
    getAccessLevel,
    setToken,
    setUser,
    login,
    logout,
    fetchUser,
    initAuth,
  };
};

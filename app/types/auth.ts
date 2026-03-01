export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  isPartner: boolean;
  isInternal: boolean;
  partnerTier?: "sandbox" | "starter" | "professional" | "enterprise";
  partnerStage?: PartnerStage;
  hasSandboxAccess?: boolean;
  hasProductionAccess?: boolean;
}

export type UserRole =
  | "public"
  | "partner:sandbox"
  | "partner:production"
  | "internal";

export type PartnerStage = "discovery" | "sandbox" | "pre-production" | "live";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PartnerAccessLevel {
  canAccessSandboxDocs: boolean;
  canAccessProductionDocs: boolean;
  canAccessApiReference: boolean;
  canAccessOperationalGuides: boolean;
}

export interface JwtDecoded {
  id: string;
  name: string;
  email: string;
  businessId: string;
  businessSlug: string;
  role: string;
  permissions: Permissions;
  modules: string[];
  iat: number;
  exp: number;
}

export type Permissions = {
  fullaccess?: boolean;
  [key: string]: boolean | Record<string, boolean> | undefined;
};

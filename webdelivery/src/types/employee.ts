export interface Employee {
  id: string;
  name: string;
  email: string;
  businessId: string;
  roleId: string;

  role?: Role;

  createdAt?: string;
  updatedAt?: string;
}

export type Permissions = {
  fullaccess?: boolean;
  [key: string]: boolean | Record<string, boolean> | undefined;
};

export interface Role {
  id: string;
  name: string;
  permissions: Permissions;
  businessId: string;
  createdAt?: string;
  updatedAt?: string;
}

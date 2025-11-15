export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
};

export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  STAFF = "Staff",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  USER = "user",
}

export interface IRole {
  id: string;
  name: string;
}

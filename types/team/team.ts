import { IRole } from "../user/role";
import { IUserPermission } from "../user/user";

export interface ITeamUser {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  createdAt: string;
  lastUpload: string;
  storageUsed: number;
  filesCount: number;
}

export interface ITeamPlan {
  id: string;
  name: string;
  status: string;
  benefitId: string;
  endDate: string;
}

export interface ITeam {
  id: string;
  company: string;
  users: ITeamUser[];
  plan: ITeamPlan;
  vanity?: boolean;
  website?: string | null;
  workspaceIcon?: string | null;
  workspaceName?: string | null;
  workspaceUrl?: string | null;
  zip?: string | null;
  state?: string | null;
  subdomain?: string | null;
  timezone?: string;
  transcript?: boolean;
  ocr?: boolean;
  address?: string | null;
  advancedCollectionShareLink?: boolean;
  cdnAccess?: boolean;
  city?: string | null;
  companySize?: string;
  country?: string | null;
}

export interface ITeamResponseData {
  teams: ITeam[];
  currentPage: number;
  total: number;
  benefits: Array<unknown>;
}

export interface ITeamMember {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  code: string;
  expirationDate: string;
  role: IRole;
  permissions?: IUserPermission[];
}

export interface IRequestFormData {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  message: string;
}

export type IEditType = "member" | "invite";

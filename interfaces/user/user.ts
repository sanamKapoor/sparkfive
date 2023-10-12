import { ITeam, ITeamUser } from "../team/team";

export interface IUser extends ITeamUser {
  roleId: string;
  team: ITeam;
}

export interface IUserResponseData {
  users: IUser[];
  currentPage: number;
  total: number;
}

export interface IUserPermission {
  id: string;
  name: string;
  category: string;
  editable: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  toggleOffFields: null;
}

export interface IGuestUploadLink {
  id: string;
  url: string;
  status: "public" | "private";
  allowCustomFields: boolean;
  password?: string;
  bannerSrc?: string;
}

export interface ILinkDefaultPayload {
  id: null;
  url: string;
  password: string;
  values: Array<unknown>;
  status: string;
  default: boolean;
}

export interface IGuestUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
}

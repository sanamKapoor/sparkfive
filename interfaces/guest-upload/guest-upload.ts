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

export interface IGuestUploadItem {
  asset: {
    name: string;
    createdAt: Date;
    size: number;
    stage: string;
    type: string;
    mimeType: string;
    fileModifiedAt: Date;
  };
  file: File;
  status: "queued" | "in-progress" | "done" | "fail";
  isUploading: boolean;
}

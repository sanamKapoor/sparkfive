import { IAsset } from "./asset";

export type UploadingStatus =
  | "uploading"
  | "done"
  | "none"
  | "re-uploading"
  | "fail"
  | "queued";

export interface IUploadingFile {
  asset: IAsset;
  file: File;
  isUploading: boolean;
  status: UploadingStatus;
  error?: string;
}

export interface IAsset {
  name: string;
  id: string;
  size: number;
  type: string; //TODO: can be restricted more
  stage: string; //TODO: can be restricted more
  fileModifiedAt: Date;
  createdAt: Date;
}

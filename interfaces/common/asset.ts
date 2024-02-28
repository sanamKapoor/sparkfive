export interface IAsset {
  name: string;
  id: string;
  size: number;
  type: string; //TODO: can be restricted more
  stage: string; //TODO: can be restricted more
  fileModifiedAt: Date;
  createdAt: Date;
}
export interface IAssetData {
  realUrl: string;
  thumbailUrl: string;
  asset: any; // Adjust the type according to your asset data structure
  sharePath: string;
  sharedCode: string;
  isShare: boolean;
  activeFolder: string;
  availableNext: boolean;
  completeAsset: any; // Adjust the type according to your complete asset data structure
  activeSubFolders: string;
  headerName: string;
}
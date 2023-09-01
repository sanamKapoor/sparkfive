import fileSize from "filesize";
import { Line } from "rc-progress";
import React from "react";
import { AssetOps } from "../../../assets";
import { IGuestUploadItem } from "../../../types/guest-upload/guest-upload";

interface UploadListItemProps {
  index: number;
  data: IGuestUploadItem;
  onRemove: (i: number) => void;
  onRetry: (i: number) => void;
  uploadingPercent: number;
}

const UploadListItem: React.FC<UploadListItemProps> = ({
  index,
  data,
  onRemove,
  onRetry,
  uploadingPercent,
}) => {
  return (
    <div key={index}>
      <img src={AssetOps.recreateThumbnail} />
      <p>{data.asset.name}</p>
      {!data.isUploading && data.status === "queued" && (
        <div>
          <Line
            percent={0}
            strokeColor="green"
            strokeWidth={3}
            trailWidth={3}
            trailColor="#e5e5e5"
            style={{ width: "100%" }}
          />
          <img src={AssetOps.cancel} onClick={() => onRemove(index)} />
        </div>
      )}
      {!data.isUploading && data.status === "fail" && (
        <div>
          <p>Upload error</p>
          <img src={AssetOps.reload} onClick={() => onRetry(index)} />
          <img src={AssetOps.cancel} onClick={() => onRemove(index)} />
        </div>
      )}

      {data.isUploading && data.status === "in-progress" && (
        <div>
          <Line
            percent={uploadingPercent}
            strokeColor="green"
            strokeWidth={3}
            trailWidth={3}
            trailColor="#e5e5e5"
            style={{ width: "100%" }}
          />
          <img src={AssetOps.cancel} />
        </div>
      )}

      {!data.isUploading && data.status === "done" && (
        <div>
          <p>{fileSize(data.file.size)}</p>
        </div>
      )}
    </div>
  );
};

export default UploadListItem;

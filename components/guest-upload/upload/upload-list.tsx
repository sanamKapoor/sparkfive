import fileSize from "filesize";
import { Line } from "rc-progress";
import { AssetOps, Utilities } from "../../../assets";
import ButtonIcon from "../../common/buttons/button-icon";

interface UploadListProps {
  files: Array<unknown>; //TODO: fix types
  onUpload: () => void;
  uploadingPercent: number;
  onRetry: (i: number) => void;
  onRemove: (i: number) => void;
  additionUploadDisabled: boolean;
  uploadingIndex: number;
}

const UploadList: React.FC<UploadListProps> = ({
  files,
  onUpload,
  uploadingPercent,
  onRetry,
  onRemove,
  additionUploadDisabled,
  uploadingIndex,
}) => {
  return (
    <div>
      <h2>
        {uploadingIndex === files.length
          ? `Ready to Submit ${files.length} files`
          : `Uploading {uploadingIndex} of {files.length} files`}
      </h2>
      <ButtonIcon
        icon={Utilities.add}
        text="Upload"
        onClick={onUpload}
        disabled={additionUploadDisabled}
      />
      {files.map((data, index) => {
        return (
          //TODO: create separate component
          <div
            key={index}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {/* TODO: change the icon */}
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
      })}
    </div>
  );
};

export default UploadList;

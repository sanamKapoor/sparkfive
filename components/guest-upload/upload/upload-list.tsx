import { Utilities } from "../../../assets";
import ButtonIcon from "../../common/buttons/button-icon";

interface UploadListProps {
  files: Array<unknown>; //TODO: fix types
}
const UploadList: React.FC<UploadListProps> = ({ files }) => {
  console.log("files: ", files);
  return (
    <div>
      <div>
        <h2>Uploading 17 of 20 files</h2>
        <ButtonIcon text="Upload" icon={Utilities.add} />
      </div>
    </div>
  );
};

export default UploadList;

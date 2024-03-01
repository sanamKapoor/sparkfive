import GooglePicker from "react-google-picker";
import toastUtils from "../../../utils/toast";

import cookiesUtils from "../../../utils/cookies";

const DriveSelector = ({ children, onFilesSelect, multiSelect = true, folderSelect = true }) => {
  const selectDriveFiles = (data) => {
    if (data.action === "picked") {
      onFilesSelect(data.docs);
    }
  };

  return (
    <GooglePicker
      clientId={process.env.GOOGLE_CLIENT_ID}
      developerKey={process.env.GOOGLE_DEVELOPER_KEY}
      scope={["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.readonly"]}
      onChange={selectDriveFiles}
      onAuthenticate={(token) => cookiesUtils.set("gdriveToken", token)}
      onAuthFailed={(error) => {
        if (error.error === "popup_closed_by_user") return;
        toastUtils.error(`Could not get google drive data, please try again alter`);
        console.log(error);
      }}
      multiselect={multiSelect}
      navHidden={true}
      authImmediate={false}
      mimeTypes={["image/png", "image/jpeg", "image/jpg", "video/mp4"]}
      viewId={"FOLDERS"}
      createPicker={(google, oauthToken) => {
        const googleViewId = google.picker.ViewId.FOLDERS;
        const docsView = new google.picker.DocsView(googleViewId)
          .setIncludeFolders(true)
          .setMimeTypes("image/jpg")
          .setSelectFolderEnabled(folderSelect);

        const picker = new window.google.picker.PickerBuilder()
          .addView(docsView)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(process.env.GOOGLE_DEVELOPER_KEY)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setCallback(selectDriveFiles);

        picker.build().setVisible(true);
      }}
    >
      {children}
    </GooglePicker>
  );
};

export default DriveSelector;

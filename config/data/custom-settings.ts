import AccountActions from "../../components/common/custom-settings/account-actions";
import Automations from "../../components/common/custom-settings/automations";
import CustomFileSizes from "../../components/common/custom-settings/custom-file-size";
import CustomViews from "../../components/common/custom-settings/custom-views";
import DeletedAssetsLibrary from "../../components/common/custom-settings/deleted-assets";
import SizeSaPresets from "../../components/common/custom-settings/size-sa-presets";
import Links from "../../components/common/guest-upload/links";

export const tabsData = [
  {
    id: "customViews",
    title: "Custom Views",
    content: CustomViews,
  },
  {
    id: "accountActions",
    title: "Account Actions",
    content: AccountActions,
  },
  {
    id: "automations",
    title: "Automations",
    content: Automations,
  },
  {
    id: "customFileSizes",
    title: "Custom File Sizes",
    content: CustomFileSizes,
  },
  {
    id: "guestUpload",
    title: "Guest Upload",
    content: Links,
  },
  {
    id: "deletedAssets",
    title: "Deleted Assets",
    content: DeletedAssetsLibrary,
  },
];

export const sizeSaPresetsTabData = {
  id: "sizeSaPresets",
  title: "Size Sa Presets",
  content: SizeSaPresets,
};

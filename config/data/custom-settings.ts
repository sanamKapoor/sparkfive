import AccountActions from "../../components/common/custom-settings/account-actions";
import Automations from "../../components/common/custom-settings/automations";
import CustomFileSizes from "../../components/common/custom-settings/custom-file-size";
import CustomViews from "../../components/common/custom-settings/custom-views";
import DeletedAssetsLibrary from "../../components/common/custom-settings/deleted-assets";
import SizeSaPresets from "../../components/common/custom-settings/size-sa-presets";
import Links from "../../components/common/guest-upload/links";
import { SUPERADMIN_ACCESS } from "../../constants/permissions";

export const tabsData = [
  {
    id: "sizeSaPresets",
    title: "Size Sa Presets",
    content: SizeSaPresets,
    permissions: [SUPERADMIN_ACCESS],
  },
  {
    id: "customViews",
    title: "Custom Views",
    content: CustomViews,
    permissions: [],
  },
  {
    id: "accountActions",
    title: "Account Actions",
    content: AccountActions,
    permissions: [],
  },
  {
    id: "automations",
    title: "Automations",
    content: Automations,
    permissions: [],
  },
  {
    id: "customFileSizes",
    title: "Custom File Sizes",
    content: CustomFileSizes,
    permissions: [],
  },
  {
    id: "guestUpload",
    title: "Guest Upload",
    content: Links,
    permissions: [],
  },
  {
    id: "deletedAssets",
    title: "Deleted Assets",
    content: DeletedAssetsLibrary,
    permissions: [],
  },
];

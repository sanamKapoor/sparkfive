import moment from "moment";
import "moment-duration-format";
import {
  MAX_UPLOAD_FILES_ALLOWED,
  MAX_UPLOAD_SIZE_ALLOWED,
} from "../constants/guest-upload";

export const convertTimeFromSeconds = (seconds) => {
  // @ts-ignore
  return moment
    .duration(seconds, "seconds")
    .format("h [hours] m [minutes] s [seconds]");
};

export const getTypeFromMimeType = (type) => {
  if (!type) return "";
  const types = type.split("/");
  return types[types.length - 1];
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const calculateStorageUsedPercent = (
  storageUsedInBytes: string,
  availableStorage: string
) => {
  const units = ["KB", "MB", "GB", "TB", "PB"]; //TODO: add more units if required
  let parseStorageUsed = parseFloat(storageUsedInBytes);

  if (parseStorageUsed === 0) {
    return 0;
  }

  const parseAvailableStorage = parseFloat(availableStorage);

  const unitOfAvailableStorage = availableStorage.slice(-2, 3);

  const unitIndex = units.findIndex((item) => item === unitOfAvailableStorage);

  if (unitIndex !== -1) {
    parseStorageUsed = parseStorageUsed / Math.pow(1024, unitIndex + 1);

    return ((parseStorageUsed / parseAvailableStorage) * 100).toFixed(2);
  }
};

interface FolderGroups {
  folderId: string;
  folderKey: string;
}

// Get folder id by file file, this is to identify which folder current upload files belong to
export const getFolderIdByFileName = (
  groups: FolderGroups[],
  fileName: string
) => {
  const lastSeparator = fileName.lastIndexOf("/");

  let newFileName = fileName;
  let folderId = null;

  if (lastSeparator !== -1) {
    const folderKey = fileName.substring(0, lastSeparator);
    newFileName = fileName.substring(lastSeparator + 1, fileName.length);
    folderId = groups.find(
      (folderItem) => folderItem.folderKey === folderKey
    ).folderId;
  }

  return {
    fileName: newFileName,
    folderId,
  };
};

// Get folder key and new name (without splash) by original file name
export const getFolderKeyAndNewNameByFileName = (
  fileName: string,
  onlyKeepParent: boolean = false
) => {
  const lastSeparator = fileName.lastIndexOf("/");
  return {
    folderKey: onlyKeepParent
      ? fileName.split("/")[0]
      : fileName.substring(0, lastSeparator),
    newName: fileName.substring(lastSeparator + 1, fileName.length),
  };
};

// validations for guest upload files
export const isFilesInputValid = (files: FileList) => {
  const totalSize = Array.from(files).reduce(
    (acc, file: File) => acc + file.size,
    0
  );

  return (
    files.length < MAX_UPLOAD_FILES_ALLOWED &&
    totalSize < MAX_UPLOAD_SIZE_ALLOWED
  );
};

export const getTotalSize = (filesData) => {
  return filesData.reduce((acc, data) => acc + data.file.size, 0);
};

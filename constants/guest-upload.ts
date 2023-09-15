export const statusList = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Private",
    value: "private",
  },
];

export const requestStatus = {
  0: "Not yet reviewed",
  1: "In Progress",
  2: "Completed",
};

export const approvalList = [
  {
    label: "Approve",
    value: "approved",
  },
  {
    label: "Reject",
    value: "rejected",
  },
];

export const maximumLinks = 3;

export const BANNER_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const BANNER_ACCEPT_FILE_TYPES = "image/png, image/jpeg, image/webp";

export const BANNER_ALLOWED_SIZE = 10 * 1024 * 1024; //10 MB

export const BANNER_MIN_WIDTH = 1920;

export const BANNER_MIN_HEIGHT = 300;

export const MAX_UPLOAD_FILES_ALLOWED = 200;

export const MAX_UPLOAD_SIZE_ALLOWED = 1 * 1024 * 1024 * 1024;

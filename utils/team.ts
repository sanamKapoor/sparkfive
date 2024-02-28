export const getExpireDate = (date: string, boolean = false) => {
  if (new Date() > new Date(date)) {
    return boolean ? true : "Invite Link Expired";
  } else {
    return boolean ? false : `Invite Link Active`;
  }
};

export const checkExpireDate = (date: string) => {
  return new Date() > new Date(date);
};

export const checkIfPLanIsActive = (planName: string) => {
  return planName.toLowerCase() !== "expired";
};

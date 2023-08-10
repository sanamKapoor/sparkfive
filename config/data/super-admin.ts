export const type = [
  {
    label: "On",
    value: true,
  },
  {
    label: "Off",
    value: false,
  },
];

export const collectionSharedLink = [
  {
    label: "On",
    value: true,
  },
  {
    label: "Off",
    value: false,
  },
];

export const defaultValues = {
  activeList: "allUsers",
  sortBy: "users.lastLogin",
  sortDirection: "ASC",
};

export const defaultUserSortData = {
  sortBy: "users.lastLogin",
  sortDirection: "ASC",
  activeList: "allAccounts",
};

export const allUsersHeaderData = [
  {
    sortId: "users.name",
    title: "User",
  },
  {
    sortId: "users.lastLogin",
    title: "Last Login",
  },
  {
    sortId: "users.createdAt",
    title: "Created At",
  },
  {
    sortId: "users.roleId",
    title: "Role",
  },
  {
    sortId: "team.company",
    title: "Company",
  },
];

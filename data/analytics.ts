<<<<<<< HEAD
export const UserTableColumns = [
    "User name", 
    "Role", 
    "Last session date", 
    "Sessions", 
    "Downloads", 
    "Shares", 
    "Actions",
];
=======
import { insights, Utilities } from "../assets";
//insight table
export const UserTableColumns = [
  "User name",
  "Role",
  "Last session date",
  "Sessions",
  "Downloads",
  "Shares",
  "Actions",
];
export const dashboardColumns = ["User name", "Sessions", "Last session date", "Actions"];
export const arrowColumns = ["User name", "Role", "Last session date", "Sessions", "Downloads", "Shares"];
export const buttonColumns = ["Actions"];
export const buttonTexts = { Actions: "User Info" };
export const insightdata = [
  {
    "User name": "Seraphina Alexandra Montgomery-Smith",
    icon: insights.userImg1,
    Role: "Admin",
    "Last session date": "Today at 04:22pm",
    Sessions: "1.27",
    Downloads: "77",
    Shares: "30",
    Actions: "Edit",
  },
  {
    "User name": "Charles Wells",
    icon: insights.userImg2,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "Harvey Elliott",
    icon: insights.userImg3,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "John Ali",
    icon: insights.userImg4,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "John Ali",
    icon: insights.userImg3,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "Betty Anderson",
    icon: insights.userImg4,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "Eugene Atkinson",
    icon: insights.userImg2,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "User name": "Eugene Atkinson",
    icon: insights.userImg3,
    Role: "Role name",
    "Last session date": "Today at 04:01pm",
    Sessions: "93",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
];

// Asset table
export const columns = ["Asset name", "Views", "Downloads", "Shares", "Actions"];
export const assetarrowColumns = [
  "Asset name",
  "Role",
  "Last session date",
  "Sessions",
  "Downloads",
  "Shares",
  "Views",
];
export const assetbuttonColumns = ["Actions"];
export const assetbuttonTexts = { Actions: "View chart" };
export const data = [
  {
    "Asset name": "sparkfive_julia_martinez_23540872.png",
    icon: insights.userImg1,
    Views: "812",
    Downloads: "77",
    Shares: "30",
    Actions: "Edit",
  },
  {
    "Asset name": "sparkfive_david_anderson_67215691.png",
    icon: insights.userImg2,
    Views: "762",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_sarah_johnson_81754025.png",
    icon: insights.userImg3,
    Views: "742",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_long_name_michael_thompson_49276284.png",
    icon: insights.userImg4,
    Views: "639",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_emily_rodriguez_94820356.png",
    icon: insights.userImg2,
    Views: "639",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_alexander_davis_75361982.png",
    icon: insights.userImg1,
    Views: "639",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_emily_rodriguez_94820356.png",
    icon: insights.userImg3,
    Views: "105",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
  {
    "Asset name": "sparkfive_alexander_davis_75361982.png",
    icon: insights.userImg3,
    Views: "92",
    Downloads: "77",
    Shares: "30",
    Actions: "Delete",
  },
];

// shared link table
export const sharedcolumns = ["Link", "Shared by", "Views", "Downloads", "Date created", "Types", "Actions"];
export const shareddashboardColumns = ["Link","Views", "Downloads", "Types", "Actions"];
export const sharedarrowColumns = ["Link", "Shared by", "Views", "Downloads", "Date created", "Types"];
export const sharedbuttonColumns = ["Action"];
export const sharedbuttonTexts = { Actions: "User Info" };

//Activity feed table
export const activitycolumns = ["User name", "Activity", "Date"];
export const activitydata = [
  {
    "User name": "Seraphina Alexandra Montgomery-Smith",
    icon: insights.userImg1,
    Activity: "Downloaded...",
    Date: "Today at 04:22 pm",
  },
  {
      "User name": "Harvey Elliott",
      icon: insights.userImg2,
      Activity: "Viewed...",
      Date: "Today 04:01 pm",
  },
  {
      "User name": "Charles Wells",
      icon: insights.userImg3,
      Activity: "Shared...",
      Date: "Today 03:55 pm",
  },
  {
      "User name": "John Ali",
      icon: insights.userImg4,
      Activity: "Viewed...",
      Date: "Today 03:31 pm",
  },
  {
      "User name": "Clyde Booth",
      icon: insights.userImg1,
      Activity: "Downloaded...",
      Date: "Today 03:08 pm",
  },
  {
      "User name": "Beverly Marshall",
      icon: insights.userImg2,
      Activity: "Downloaded",
      Date: "Today 03:01 pm",
  },
  {
      "User name": "Harvey Elliott",
      icon: insights.userImg2,
      Activity: "Viewed...",
      Date: "Today 04:01 pm",
  },
  {
      "User name": "Seraphina Alexandra Montgomery-Smith",
      icon: insights.userImg1,
      Activity: "Downloaded...",
      Date: "Today at 04:22 pm",
    },

];
export const activityarrowColumns = ["User name", "Activity", "Date",];
export const activitybuttonColumns = ["Actions"];
export const activitybuttonTexts = { Actions: "User info" };

//modal
>>>>>>> 422390eca163ccc0a28188cb36ed6d376a413294

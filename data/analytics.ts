import { insights, Utilities } from "../assets";
import { analyticsRoutes } from "../constants/analytics";
import { NavItem } from "../interfaces/analytics"

export const NavItems: NavItem[] = [
  {
    id: 1,
    parent: "Main",
    components: [
      {
        route: analyticsRoutes.DASHBOARD,
        label: "Dashboard",
        image: insights.insightDashboard,
      },
    ],
  },
  {
    id: 2,
    parent: "In Account",
    components: [
      {
        route: analyticsRoutes.ACCOUNT_USERS,
        label: "Users",
        image: insights.insightUser,
      },
      {
        route: analyticsRoutes.ACCOUNT_ASSETS,
        label: "Assets",
        image: insights.insightAsset,
      },
      {
        route: analyticsRoutes.ACCOUNT_TEAM,
        label: "Teams",
        image: insights.insightGroups,
      },
    ],
  },
  {
    id: 3,
    parent: "External",
    components: [
      {
        route: analyticsRoutes.EXTERNAL_USERS,
        label: "Users",
        image: insights.insightUser,
      },
      {
        route: analyticsRoutes.EXTERNAL_ASSETS,
        label: "Assets",
        image: insights.insightAsset,
      },
      {
        route: analyticsRoutes.EXTERNAL_LINK,
        label: "Shared link",
        image: insights.insightShare,
      },
    ],
  },
];

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
export const DashboardUserColumns = ["User name", "Sessions", "Last session date", "Actions"];
export const arrowColumns = [
  {
    label: "User name",
    value: "name"
  },
  {
    label: "Role",
    value: "role"
  },
  {
    label: "Last session date",
    value: "lastSession"
  },
  {
    label: "Sessions",
    value: "sessionCount"
  },
  {
    label: "Downloads",
    value: "downloads"
  },
  {
    label: "Shares",
    value: "shares"
  }
];
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
export const assetColumns = ["Asset name", "Views", "Downloads", "Shares", "Actions"];
export const assetarrowColumns = [
  {
    label: "Asset name",
    value: "name"
  },
  {
    label: "Sessions",
    value: "session_count"
  },
  {
    label: "Downloads",
    value: "downloads"
  },
  {
    label: "Shares",
    value: "shares"
  },
  {
    label: "Views",
    value: "views"
  }
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
// export const activitycolumns = ["User name", "Activity", "Date"];
// export const activitydata = [
//   {
//     "User name": "Seraphina Alexandra Montgomery-Smith",
//     icon: insights.userImg1,
//     Activity: "Downloaded...",
//     Date: "Today at 04:22 pm",
//   },
//   {
//       "User name": "Harvey Elliott",
//       icon: insights.userImg2,
//       Activity: "Viewed...",
//       Date: "Today 04:01 pm",
//   },
//   {
//       "User name": "Charles Wells",
//       icon: insights.userImg3,
//       Activity: "Shared...",
//       Date: "Today 03:55 pm",
//   },
//   {
//       "User name": "John Ali",
//       icon: insights.userImg4,
//       Activity: "Viewed...",
//       Date: "Today 03:31 pm",
//   },
//   {
//       "User name": "Clyde Booth",
//       icon: insights.userImg1,
//       Activity: "Downloaded...",
//       Date: "Today 03:08 pm",
//   },
//   {
//       "User name": "Beverly Marshall",
//       icon: insights.userImg2,
//       Activity: "Downloaded",
//       Date: "Today 03:01 pm",
//   },
//   {
//       "User name": "Harvey Elliott",
//       icon: insights.userImg2,
//       Activity: "Viewed...",
//       Date: "Today 04:01 pm",
//   },
//   {
//       "User name": "Seraphina Alexandra Montgomery-Smith",
//       icon: insights.userImg1,
//       Activity: "Downloaded...",
//       Date: "Today at 04:22 pm",
//     },

// ];
// export const activityarrowColumns = ["User name", "Activity", "Date",];
// export const activitybuttonColumns = ["Actions"];
// export const activitybuttonTexts = { Actions: "User info" };

//modal
// shared user modal
export const shareModaldata = [
  {
    Activity: "Downloaded sparkfive_julia_martinez_23540872.png",
    "User name": "rsorwheide@acme.com",
    Date: "Today at 04:22 pm",
  },
  {
    Activity: "Viewed sparkfive_david_anderson_67215691.png",
    "User name": "dmoon@acme.com",
    Date: "Today at 04:22 pm",
  },
  {
      Activity: "Viewed sparkfive_sarah_johnson_81754025.png",
      "User name": "tweber@acme.com",
      Date: "Yesterday 03:55 pm"
  },
  {
      Activity: "Downloaded sparkfive_emily_rodriguez_94820356.png",
      "User name": "ajefferson@acme.com",
      Date: "05/14/23"
  },
  {
      Activity: "Downloaded sparkfive_leo_graham_94820356.png",
      "User name": "jgraham@acme.com",
      Date: "05/14/23"
  },
];
export const shareModalColumns = ["Activity", "User name", "Date"];
export const shareModalarrowColumns = ["Activity", "User name", "Date"];
export const shareModalbuttonColumns = ["Actions"];
 
export const shareLinksData = [
  {
    Link: "Best Tips for Gardening",
    "Shared by": "Seraphina Alexandra Montgomery-Smith",
    icon: insights.userImg1,
    Views: "4,1388",
    Downloads: "444",
    "Date created": "01/03/23",
    Types: "Collection",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Delicious Recipes to Try at Home",
    "Shared by": "Harvey Elliott",
    icon: insights.userImg2,
    Views: "4,077",
    Downloads: "572",
    "Date created": "03/23/23",
    Types: "Portal",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Ultimate Guide to Traveling Solo",
    "Shared by": "Charles Wells",
    icon: insights.userImg3,
    Views: "4,077",
    Downloads: "572",
    "Date created": "03/23/23",
    Types: "Collection",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Fitness Workout Routines for Beginners",
    "Shared by": "John Ali",
    icon: insights.userImg4,
    Views: "4,077",
    Downloads: "572",
    "Date created": "03/23/23",
    Types: "Portal",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Learn Spanish in 30 Days",
    "Shared by": "Clyde Booth",
    icon: insights.userImg1,
    Views: "4,077",
    Downloads: "572",
    "Date created": "03/23/23",
    Types: "Collection",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Top Destinations for Adventure Enthusiasts",
    "Shared by": "Beverly Marshall",
    icon: insights.userImg2,
    Views: "4,077",
    Downloads: "572",
    "Date created": "03/23/23",
    Types: "Files",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Learn Spanish in 30 Days",
    "Shared by": "Irene James",
    icon: insights.userImg4,
    Views: "4,077",
    Downloads: "377",
    "Date created": "03/23/23",
    Types: "Collection",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
  {
    Link: "Top Destinations for Adventure Enthusiasts",
    "Shared by": "Betty Anderson",
    icon: insights.userImg3,
    Views: "4,077",
    Downloads: "377",
    "Date created": "03/23/23",
    Types: "Files",
    Actions: [
      {
        src: insights.tableEye,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableUser,
        className: ["action-icon", "eye-icon"]
      },
      {
        src: insights.tableHome,
        className: ["action-icon", ""]
      }
    ],
  },
];
export const shareModalbuttonTexts = { Actions: "View Asset" };

// User modal
export const activitycolumns = ["User name", "Activity", "Date"];
export const userModalcolumns = ["Viewed Link", "Viewed File", "Download File", "Date", "Actions"];
export const userModaldata = [
  {
    "Viewed Link": "Best Tips for Gardening",
    "Viewed File": "sparkfive_noah_johnson_78652439.png",
    "Download File": "—",
    Date: "Today at 04:22 pm",
    Actions: "Edit",
  },
  {
    "Viewed Link": "Delicious Recipes to Try at Home",
    "Viewed File": "sparkfive_noah_johnson_78652439.png",
    "Download File": "sparkfive_ava_anderson_75849321_3.png",
    Date: "Yesterday 03:55 pm",
    Actions: "Edit",
  },
  {
    "Viewed Link": "Ultimate Guide to Traveling Solo",
    "Viewed File": "sparkfive_sophia_wilson_36548712.png",
    "Download File": "sparkfive_william_martinez_35671248_3.png",
    Date: "Yesterday 03:55 pm",
    Actions: "Edit",
  },
  {
    "Viewed Link": "Fitness Workout Routines for Beginners",
    "Viewed File": "sparkfive_ethan_thompson_92468135.png",
    "Download File": "sparkfive_olivia_smith_12458967_2.pngg",
    Date: "05/14/23",
    Actions: "Edit",
  },
  {
    "Viewed Link": "Learn Spanish in 30 Days",
    "Viewed File": "—",
    "Download File": "—",
    Date: "05/14/23",
  },
  {
    "Viewed Link": "Chief Science Officer",
    "Viewed File": "sparkfive_william_martinez_35671248.png",
    "Download File": "sparkfive_ethan_thompson_92468135_2.png",
    Date: "05/14/23",
  },
];

export const userModalarrowColumns = ["Viewed Link", "Viewed File", "Download File", "Sessions", "Date"];
export const userModalbuttonColumns = ["Actions"];

export const userModalbuttonTexts = { Actions: "View Asset" };

// User Activity
export const userActivityModalcolumns = ["Activity", "Date", "Action"];
export const userActivityModalArrowColumns = [
  {
    label: "User name",
    value: "user_name",
  },
  {
    label: "Activity",
    value: "name",
  },
  {
    label: "Date",
    value: "updatedAt"
  },
];
export const userActivityModalButtonColumns = ["Action"];
export const userActivityModalButtonTexts = { Actions: "View Link" };

// Dashboard 
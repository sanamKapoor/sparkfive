import { themeVariableName } from "../constants/theme";
import {
  defaultHeadNavColor,
  defaultPrimaryColor,
  defaultSecondaryColor,
  defaultAdditionalColor,
} from "../constants/theme";

export const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem(themeVariableName);
  return JSON.parse(theme || "{}");
};

export const getIconColor = () => {
  const theme = getThemeFromLocalStorage();
  return theme.primary || defaultPrimaryColor;
};

export const getSecondaryColor = () => {
  const theme = getThemeFromLocalStorage();
  return theme.secondary || defaultSecondaryColor;
};

// Set theme at :root level
export const setTheme = (type: string, value: any, ignoreSetStorage = false) => {
  switch (type) {
    case "headerNavigation": {
      document.documentElement.style.setProperty("--header-navigation-color", value);

      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        theme.headerNavigation = value;
        localStorage.setItem(themeVariableName, JSON.stringify(theme));
      }

      break;
    }

    case "primary": {
      document.documentElement.style.setProperty("--primary-color", value);

      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        theme.primary = value;
        localStorage.setItem(themeVariableName, JSON.stringify(theme));
      }
      break;
    }

    case "secondary": {
      document.documentElement.style.setProperty("--secondary-color", value);

      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        theme.secondary = value;
        localStorage.setItem(themeVariableName, JSON.stringify(theme));
      }
      break;
    }

    case "additional": {
      document.documentElement.style.setProperty("--additional-color", value);

      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        theme.additional = value;
        localStorage.setItem(themeVariableName, JSON.stringify(theme));
      }
      break;
    }

    case "logo": {
      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        theme.logo = value;
        localStorage.setItem(themeVariableName, JSON.stringify(theme));
      }

      break;
    }

    // In case load from database
    case "logoImage": {
      if (!ignoreSetStorage) {
        const theme = getThemeFromLocalStorage();
        if (value) {
          theme.logo = {
            id: value.asset.id,
            url: value.realUrl,
          };
          localStorage.setItem(themeVariableName, JSON.stringify(theme));
        }
      }
    }
  }
};

export const loadTheme = (themeData?: any) => {
  console.log(`>>> Load theme...`);

  let theme = {};

  if (themeData) {
    theme = themeData;

    delete themeData.logo;

    Object.keys(theme).map((key) => {
      setTheme(key, theme[key]);
    });
  } else {
    theme = getThemeFromLocalStorage();

    Object.keys(theme).map((key) => {
      setTheme(key, theme[key], true);
    });
  }

  return theme;
};

export const resetTheme = () => {
  localStorage.removeItem(themeVariableName);
  document.documentElement.style.setProperty("--header-navigation-color", defaultHeadNavColor);
  document.documentElement.style.setProperty("--primary-color", defaultPrimaryColor);
  document.documentElement.style.setProperty("--secondary-color", defaultSecondaryColor);
  document.documentElement.style.setProperty("--additional-color", defaultAdditionalColor);
};

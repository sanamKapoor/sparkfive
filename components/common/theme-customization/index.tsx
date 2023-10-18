import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";

import Setting from "./setting";
import Logotype from "./logotype";

import { setTheme, getThemeFromLocalStorage } from "../../../utils/theme";
import toastUtils from "../../../utils/toast";

import {
  defaultPrimaryColor,
  defaultSecondaryColor,
  defaultAdditionalColor,
  defaultHeadNavColor,
} from "../../../constants/theme";

import { GeneralImg } from "../../../assets";

import { UserContext, LoadingContext } from "../../../context";

import teamApi from "../../../server-api/team";

export default function ThemeCustomization() {
  const { setLogo, logo } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const [headNavColor, setHeadNavColor] = useState(defaultHeadNavColor);
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(defaultSecondaryColor);
  const [additionalColor, setAdditionalColor] = useState(defaultAdditionalColor);

  const [currentLogo, setCurrentLogo] = useState<any>({ id: 0, url: logo });

  console.log(logo);

  const onResetColor = () => {
    setHeadNavColor(defaultHeadNavColor);
    setPrimaryColor(defaultPrimaryColor);
    setSecondaryColor(defaultSecondaryColor);
    setAdditionalColor(defaultAdditionalColor);
  };

  const onResetLogo = () => {
    setCurrentLogo({ id: 0, url: GeneralImg.logo });
  };

  const onUploadLogo = () => {};

  const onSave = async () => {
    setIsLoading(true);
    await teamApi.updateTheme({
      headerNavigation: headNavColor,
      primary: primaryColor,
      secondary: secondaryColor,
      additional: additionalColor,
      logo: currentLogo.id || null,
    });
    setTheme("headerNavigation", headNavColor);
    setTheme("primary", primaryColor);
    setTheme("secondary", secondaryColor);
    setTheme("additional", additionalColor);
    setTheme("logo", currentLogo);

    setLogo(currentLogo.url);

    setIsLoading(false);

    toastUtils.success("Theme changes successfully");
  };

  const loadCurrentTheme = () => {
    // Call API to get team theme then set to local storage
    const theme = getThemeFromLocalStorage();
    setHeadNavColor(theme?.headerNavigation || defaultHeadNavColor);
    setPrimaryColor(theme?.primary || defaultPrimaryColor);
    setSecondaryColor(theme?.secondary || defaultSecondaryColor);
    setAdditionalColor(theme?.additional || defaultAdditionalColor);
  };

  useEffect(() => {
    loadCurrentTheme();
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.title}>Colors</div>
        <button className={styles["reset-btn"]} onClick={onResetColor}>
          Reset to default
        </button>
      </div>

      <Setting
        title={"Header & Navigation color"}
        subTitle={"Recommendation: Choose a color that contrasts with white"}
        value={headNavColor}
        onChange={(value) => {
          setHeadNavColor(value);
        }}
      />
      <Setting
        title={"Primary color"}
        subTitle={"This color will be used in the main elements such as the color of text, icons, tabs, and more."}
        value={primaryColor}
        onChange={(value) => {
          setPrimaryColor(value);
        }}
      />
      <Setting
        title={"Secondary color"}
        subTitle={"This color will mainly be used for the buttons, as well as to provide contrast to the primary color"}
        value={secondaryColor}
        onChange={(value) => {
          setSecondaryColor(value);
        }}
      />
      <Setting
        title={"Additional color"}
        subTitle={"This color is used in the drop-down selection menu, modal window, loading progress, etc."}
        value={additionalColor}
        onChange={(value) => {
          setAdditionalColor(value);
        }}
      />

      <div className={"m-t-36"}>
        <div className={styles.header}>
          <div className={styles.title}>Logotype</div>
          <button className={styles["reset-btn"]} onClick={onResetLogo}>
            Reset to default
          </button>
        </div>
      </div>

      <Logotype
        currentLogo={currentLogo}
        onChange={(value) => {
          setCurrentLogo({
            id: value.asset.id,
            url: value.realUrl,
          });
        }}
      />

      <button className={styles["save-btn"]} onClick={onSave}>
        Save
      </button>
    </div>
  );
}

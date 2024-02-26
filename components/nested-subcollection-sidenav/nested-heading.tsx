import React, { ReactNode, useContext } from "react";
import { ASSET_UPLOAD_NO_APPROVAL } from "../../constants/permissions";
import { UserContext } from "../../context";
import NestedButton from "./button";
import styles from "./nested-heading.module.css";

const ReusableHeading = ({
  headingTrue,
  totalCount,
  text,
  icon,
  headingClick,
  headingClickType = "",
  description = "",
  customStyle,
  fontSize,
}: {
  totalCount?: number;
  text: string;
  icon: ReactNode;
  headingClick?: Function;
  headingClickType?: string;
  headingTrue?: boolean;
  description?: string;
  customStyle?: React.CSSProperties;
  fontSize?: string;
}) => {
  const { hasPermission } = useContext(UserContext);

  const showCollectionCreateIcon =
    text === "All Collections" && hasPermission([ASSET_UPLOAD_NO_APPROVAL]);

  return (
    <div data-drag="false" className={`${styles["heading-contents"]} ${icon ? styles["heading-mob"] : ""}`} style={{...customStyle,fontSize}}>
      <div 
      data-drag="false"
        className={`normal-text ${styles["sidenav-heading"]} ${headingTrue ? styles["active"] : ""
          }`}
       
      >
        <div data-drag="false" onClick={() => headingClick(headingClickType, description)}>
          {`${text} ${totalCount ? `(${totalCount})` : ""}`}
        </div>
        {showCollectionCreateIcon && <NestedButton type={"collection"} />}
      </div>
      {icon && <div data-drag="false" className="left-icon">{icon}</div>}
    </div>
  );
};

export default ReusableHeading;

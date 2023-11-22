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
    <div className={`${styles["heading-contents"]} ${icon ? styles["heading-mob"] : ""}`} style={customStyle}>
      <div
        className={`${styles["sidenav-heading"]} ${headingTrue ? styles["active"] : ""
          }`}
        style={{ cursor: "default" }}
      >
        <div onClick={() => headingClick(headingClickType, description)}>
          {`${text} ${totalCount ? `(${totalCount})` : ""}`}
        </div>
        {showCollectionCreateIcon && <NestedButton type={"collection"} />}
      </div>
      {icon && <div className="left-icon">{icon}</div>}
    </div>
  );
};

export default ReusableHeading;

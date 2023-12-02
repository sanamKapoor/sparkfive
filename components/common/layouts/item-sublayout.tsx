import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Utilities } from "../../../assets";
import { TeamContext, UserContext } from "../../../context";
import styles from "./item-sublayout.module.css";

import { ASSET_ACCESS } from "../../../constants/permissions";

// Components
import ItemAssets from "../asset/item-assets";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import ConfirmModal from "../modals/confirm-modal";

const ItemSublayout = ({
  SideComponent = null,
  navElements = [],
  children,
  layout = "double",
  type = "item",
  hasAssets = false,
  itemId = "",
  deleteItem = () => {},
  duplicateProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMain, setActiveMain] = useState("details");

  const [sideOpen, setSideOpen] = useState(false);

  const { getTeamMembers } = useContext(TeamContext);
  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    getTeamMembers();
    if (!isMobile) {
      setSideOpen(true);
    }
  }, []);

  const toggleSideMenu = () => {
    setSideOpen(!sideOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles["main-component"]}>
        <div className={styles.heading}>
          <div className={styles[layout]}>
            <Button
              text="Details"
              className={activeMain === "details" ? "section-container section-active" : "section-container"}
              onClick={() => setActiveMain("details")}
            />
            {hasAssets && hasPermission([ASSET_ACCESS]) && (
              <Button
                text="Assets"
                className={activeMain === "assets" ? "section-container section-active" : "section-container"}
                onClick={() => setActiveMain("assets")}
              />
            )}
          </div>
        </div>
        <div className={styles.children}>
          {activeMain === "details" && <>{children}</>}
          {activeMain === "assets" && <ItemAssets type={type} itemId={itemId} />}
        </div>
      </div>

      {SideComponent && sideOpen && <div className={styles["side-component"]}>{SideComponent}</div>}

      <div className={styles["side-bar"]}>
        {navElements.length > 0 && (
          <>
            <div>
              <IconClickable
                src={Utilities.closePanelLight}
                onClick={toggleSideMenu}
                additionalClass={!sideOpen && "mirror"}
              />
            </div>
            <div className={styles.separator}></div>
            <div className={styles.elements}>
              {navElements.map((navElement, index) => (
                <img key={index} src={navElement.icon} onClick={navElement.onClick} />
              ))}
            </div>
            <div className={styles.separator}></div>
          </>
        )}
        <ToggleableAbsoluteWrapper
          wrapperClass={styles.more}
          Wrapper={({ children }) => (
            <>
              <Utilities.moreLight />
              {children}
            </>
          )}
          contentClass={styles["more-drop"]}
          Content={() => {
            const options = [];
            if (duplicateProject)
              options.push({
                label: "Duplicate",
                onClick: () => duplicateProject(),
              });
            options.push({
              label: "Delete",
              onClick: () => setModalOpen(true),
            });

            return <Dropdown options={options} />;
          }}
        />
      </div>
      {/* Delete modal */}
      <ConfirmModal
        closeModal={() => setModalOpen(false)}
        confirmAction={() => {
          deleteItem();
          setModalOpen(false);
        }}
        confirmText={"Delete"}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this {type}?
          </span>
        }
        modalIsOpen={modalOpen}
      />
    </div>
  );
};

export default ItemSublayout;

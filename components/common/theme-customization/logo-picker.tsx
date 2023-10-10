import { useState } from "react";

import styles from "./logotype.module.css";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

import { Utilities } from "../../../assets";

import LogoTypeSelection from "./logo-type-selection";
import BaseModal from "../modals/base";

const isMobile = () => {
  // @ts-ignore
  return window.innerWidth < 600;
};

export default function LogoPicker({ onChange }: Props) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div>
      <ToggleableAbsoluteWrapper
        wrapperClass={styles["logotype-wrapper"]}
        closeOnAction={false}
        open={showPanel}
        Wrapper={({ children }) => (
          <>
            <button
              className={styles["change-logotype-btn"]}
              onClick={() => {
                setShowPanel(true);
              }}
            >
              <img className={styles["icon-btn"]} src={Utilities.circlePlusGreen} alt={"change-logo-type"} />
              Change Logotype
            </button>
            {children}
          </>
        )}
        contentClass={styles["logotype-dropdown"]}
        Content={() => (
          <LogoTypeSelection
            onSelect={(value) => {
              setShowPanel(false);
              onChange(value);
            }}
            onClose={() => {
              setShowPanel(false);
            }}
          />
        )}
      />

      <button
        className={`${styles["change-logotype-btn"]} ${styles["mobile-only"]}`}
        onClick={() => {
          setShowPanel(true);
        }}
      >
        <img className={styles["icon-btn"]} src={Utilities.circlePlusGreen} alt={"change-logo-type"} />
        Change Logotype
      </button>

      {isMobile() && (
        <BaseModal
          showCancel={false}
          closeButtonOnly
          // additionalClasses={[styles["modal-upload"]]}
          closeModal={() => {
            setShowPanel(false);
          }}
          modalIsOpen={showPanel}
          confirmText=""
          confirmAction={() => {}}
        >
          <LogoTypeSelection
            onSelect={(value) => {
              setShowPanel(false);
              onChange(value);
            }}
            onClose={() => {
              setShowPanel(false);
            }}
          />
        </BaseModal>
      )}
    </div>
  );
}

interface Props {
  onChange: (value: any) => void;
}

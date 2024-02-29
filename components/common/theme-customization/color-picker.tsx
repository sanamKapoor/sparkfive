import { useState } from "react";

import styles from "./color-picker.module.css";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

import { Utilities } from "../../../assets";

import ColorSelection from "./color-selection";
import BaseModal from "../modals/base";

const isMobile = () => {
  // @ts-ignore
  return window.innerWidth < 600;
};

export default function ColorPicker({ value, onChange }: Props) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className={styles.wrapper}>
      <ToggleableAbsoluteWrapper
        wrapperClass={styles["color-wrapper"]}
        closeOnAction={false}
        open={showPanel}
        Wrapper={({ children }) => (
          <>
            <div
              className={styles["color-preview"]}
              style={{ background: value }}
              onClick={() => {
                setShowPanel(true);
              }}
            ></div>
            {children}
          </>
        )}
        contentClass={styles["color-dropdown"]}
        Content={() => (
          <ColorSelection
            defaultColor={value}
            onSelect={(value) => {
              onChange(value);
              setShowPanel(false);
            }}
            onCancel={() => {
              setShowPanel(false);
            }}
          />
        )}
      />
      <div
        className={`${styles["color-preview"]} ${styles["mobile-only"]}`}
        style={{ background: value }}
        onClick={() => {
          setShowPanel(true);
        }}
      ></div>
      <div className={styles["color-hex"]}>{value?.toUpperCase()}</div>

      {isMobile() && (
        <div className={styles["mobile-only"]}>
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
            <ColorSelection
              defaultColor={value}
              onSelect={(value) => {
                onChange(value);
                setShowPanel(false);
              }}
              onCancel={() => {
                setShowPanel(false);
              }}
            />
          </BaseModal>
        </div>
      )}
    </div>
  );
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

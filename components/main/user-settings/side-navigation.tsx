import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../../context";
import styles from "./side-navigation.module.css";

// Components
const UserSettings = ({ activeView, SETTING_OPTIONS }) => {
  const { hasPermission } = useContext(UserContext);

  return (
    <section className={styles.container}>
      <ul>
        {Object.entries(SETTING_OPTIONS)
          .filter(([_, optionProps]) => hasPermission(optionProps.permissions))
          .map(([option, optionProps], index) => (
            <>
              {option === "account" && <h6>ADMINISTRATION</h6>}
              {option === "attributes" && <h6>SETTINGS</h6>}
              <Link
                href={
                  option === "upload-approvals"
                    ? optionProps.path
                    : `/main/user-settings/${option}`
                }
                key={index}
              >
                <a>
                  <li
                    className={`${styles.setting} ${
                      activeView === option && styles.selected
                    }`}
                  >
                    <span>{optionProps.label}</span>
                  </li>
                </a>
              </Link>
            </>
          ))}
      </ul>
    </section>
  );
};

export default UserSettings;

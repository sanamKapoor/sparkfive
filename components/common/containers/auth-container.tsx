import { Component } from "react";
import styles from "./auth-container.module.css";

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children?: any;
  additionalClass?: string;
  vanityCompanyInfo?: { workspaceIcon: string };
  titleComponent?: Component;
  subTitleComponent?: Component;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  subtitle = "",
  children,
  additionalClass = "",
  vanityCompanyInfo,
  titleComponent,
  subTitleComponent,
}) => (
  <section className={`${styles.container} ${additionalClass}`}>
    {vanityCompanyInfo && (
      <img
        className={styles.logo}
        alt={"logo"}
        src={vanityCompanyInfo.workspaceIcon}
      />
    )}
    {!vanityCompanyInfo && (
      <>
        {titleComponent ? titleComponent : <h2>{title}</h2>}

        {subTitleComponent ? (
          subTitleComponent
        ) : (
          <>{subtitle && <h4>{subtitle}</h4>}</>
        )}
      </>
    )}

    <div className="card-content">{children}</div>
  </section>
);

export default AuthContainer;

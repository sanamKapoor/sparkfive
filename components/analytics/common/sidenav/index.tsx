import React, { useContext, useEffect, useState } from "react";
import styles from "./insights-sidennav.module.css";
import { NavItems } from "../../../../data/analytics";
import { useRouter } from "next/router";
import { Utilities } from "../../../../assets";

export default function InsightsSideNav() {
  const router = useRouter();
  const [showNav, setShowNav] = useState(true);

  const handleItemClick = (route: string) => {
    if(window.innerWidth < 901) setShowNav(false);
    router.push(route);
  };

  useEffect(() => {
    setShowNav(window.innerWidth > 900 ? true : false);
  }, []);

  return (
    <>
      <div className={styles.menubar}>
        <div className={styles.nestedMenu} onClick={() => setShowNav(!showNav)}>
          <div className={styles.menuIcon}>
            <img className={styles.rightIcon} src={Utilities.menu} />
          </div>
          <div className={styles.menuDesc}>
            <span>Menu</span>
          </div>
        </div>
      </div>
      {showNav && <section className={styles.container}>
        {NavItems.map((item) => {
          return (
            <>
              <h6 className={styles.upper}>{item.parent}</h6>
              {item.components.length > 0 && (
                <ul>
                  {item.components.map((comp, index) => {
                    return (
                      <li
                        key={index}
                        className={`${styles.setting} ${router.pathname === comp.route && styles.selected}`}
                        onClick={() => handleItemClick(comp.route)}
                      >
                        <a className={styles.info}>
                          <img src={comp.image} alt={`${comp.label}-img`} />
                          <span>{comp.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          );
        })}
      </section>}
    </>
  );
}

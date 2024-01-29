import React, { useContext, useState } from "react";
import styles from "./insights-sidennav.module.css";
import { NavItems } from "../../../../data/analytics";
import { useRouter } from "next/router";

export default function InsightsSideNav() {

  const router = useRouter();  
  const handleItemClick = (route: string) => {
    router.push(route);    
  };

  return (
    <section className={styles.container}>
      {
        NavItems.map((item) => {
          return (
            <>
              <h6>{item.parent}</h6>
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
        })
      }
    </section>
  );
}


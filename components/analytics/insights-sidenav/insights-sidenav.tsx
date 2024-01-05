import React, { useState } from "react";
import styles from "./insights-sidennav.module.css";
import { insights } from "../../../assets";
import { analyticsLayoutSection } from "../../../constants/analytics";

interface NavItem {
  id: number,
  parent: string,
  components: Array<{
    type: string,
    label: string,
    image: string
  }>
}

const navItems: NavItem[] = [
  {
    id: 1,
    parent: "Main",
    components: [
      {
        type: analyticsLayoutSection.DASHBOARD,
        label: "Dashboard",
        image: insights.insightDashboard
      }
    ]
  },
  {
    id: 2,
    parent: "In Account",
    components: [
      {
        type: analyticsLayoutSection.ACCOUNT_USERS,
        label: "Users",
        image: insights.insightUser
      },
      {
        type: analyticsLayoutSection.ACCOUNT_ASSETS,
        label: "Assets",
        image: insights.insightAsset
      },
      {
        type: analyticsLayoutSection.TEAM,
        label: "Teams",
        image: insights.insightGroups
      }
    ]
  },
  {
    id: 3,
    parent: "External",
    components: [
      {
        type: analyticsLayoutSection.EXTERNAL_USERS,
        label: "Users",
        image: insights.insightUser
      },
      {
        type: analyticsLayoutSection.EXTERNAL_ASSETS,
        label: "Assets",
        image: insights.insightAsset
      },
      {
        type: analyticsLayoutSection.SHARED_LINK,
        label: "Shared link",
        image: insights.insightShare
      }
    ]
  }
]

export default function InsightsSidenav({
  activeSection,
  setActiveSection
}: {
  activeSection: string,
  setActiveSection: (section: string) => void
}) {

  const handleItemClick = (section) => {
    setActiveSection(section);
  };

  return (
    <section className={styles.container}>
      {
        navItems.map((item) => <RenderSideBar key={item.id} item={item} />)
      }
    </section>
  );


  function RenderSideBar({ item }: { item: NavItem }) {
    return (
      <>
        <h6>{item.parent}</h6>
        {item.components.length > 0 &&
          <ul>
            {
              item.components.map((comp, index) => {
                return (
                  <li 
                    key={index} 
                    className={`${styles.setting} ${activeSection === comp.type && styles.selected}`} 
                    onClick={() => handleItemClick(comp.type)}
                  >
                    <a
                      className={styles.info}

                    >
                      <img src={comp.image} alt={`${comp.label}-img`} />
                      <span>{comp.label}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        }
      </>
    )
  }
}

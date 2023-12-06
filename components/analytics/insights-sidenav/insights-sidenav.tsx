import React, { useState } from "react";
import styles from "./insights-sidennav.module.css";
import Link from "next/link";
import { insights } from "../../../assets";

const navigationItems = [
  { label: "Dashboard", image: insights.insightDashboard, href: "" },
  { label: "Users", image: insights.insightUser, href: "" },
  { label: "Assets", image: insights.insightAsset, href: "" },
  { label: "Teams", image: insights.insightGroups, href: "" },
  { label: "Shared link", image: insights.insightShare, href: "" },
];

export default function InsightsSidenav() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (index) => {
    setSelectedItem(index === selectedItem ? null : index);
  };

  return (
    <section className={styles.container}>
      {renderSection("MAIN", [0])}
      {renderSection("IN ACCOUNT", [1, 2, 3])}
      {renderSection("EXTERNAL", [1, 2, 4])}
    </section>
  );

  function renderSection(sectionTitle, itemIndexes) {
    return (
      <>
        <h6>{sectionTitle}</h6>
        <ul>
          {itemIndexes.map((index) => {
            const { label, image, href } = navigationItems[index];
            const isSelected = index === selectedItem;

            return (
              <li key={label} className={`${styles.setting} ${isSelected && styles.selected}`}>
                <Link href={href}>
                  <a
                    className={styles.info}
                    href={href}
                    onClick={() => handleItemClick(index)}
                  >
                    <img src={image} alt={`${label}-img`} />
                    <span>{label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}

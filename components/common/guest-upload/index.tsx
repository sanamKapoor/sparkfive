import { useState } from "react";
import styles from "./index.module.css";

// Components
import { useRouter } from "next/router";
import Button from "../buttons/button";
import Links from "./links";

const GuestUpload = () => {
  const { query } = useRouter();

  const getDefaultTab = () => {
    switch (query.tab) {
      case "0": {
        return "links";
      }
      case "1": {
        return "requests";
      }
      default: {
        return "links";
      }
    }
  };

  const [activeList, setActiveList] = useState(getDefaultTab());

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text="Links"
          className={
            activeList === "links"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("links")}
        />
      </div>

      {activeList === "links" && <Links />}
    </>
  );
};

export default GuestUpload;

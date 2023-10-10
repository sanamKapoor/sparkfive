//🚧 work in progress 🚧
import React from "react";

import Divider from "./divider";
import OptionDataItem from "./option-data-item";
import styles from "./options-data.module.css";

interface OptionDataProps {
  data: any; //TODO
}

const OptionData: React.FC<OptionDataProps> = ({ data }) => {
  console.log("data: ", data);
  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        {data.map((item) => (
          <div className={styles["grid-item"]} key={item.id}>
            <OptionDataItem name={item.name} count={item.count} />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default OptionData;

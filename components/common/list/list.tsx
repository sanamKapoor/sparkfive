import React from "react";

import styles from "./index.module.css";

interface ListProps {
  term: string;
  setTerm: (val: string) => void;
  termForDownload: string;
  setTermForDownload: (val: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
  downloadDetails: () => void;
  searchAndFetch: () => void;
  headersData: { sortId: string; title: string }[];
}

const List: React.FC<ListProps> = ({}) => {
  return (
    <ul className={styles.list}>
      {/* loop through reusable header component */}
      {/* loop through reusable item component */}
    </ul>
  );
};

export default List;

import { useEffect, useState } from "react";
// @ts-ignore
import Search from "../attributes/search-input";
import styles from "./asset-transcript.module.css";

const AssetTranscript = ({ title, transcripts }) => {
  const [transcriptData, setTranscriptData] = useState(transcripts);

  const search = (value) => {
    const searchResults = transcripts.filter(
      (item) => item.text.toLowerCase().indexOf(value.toLowerCase()) > -1
    );

    setTranscriptData(searchResults);
  };

  const onClear = () => {};

  useEffect(() => {
    setTranscriptData(transcripts);
  }, [transcripts]);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.wrapper}>
        <h2>{title}</h2>
      </div>

      {transcriptData.length > 0 && (
        <Search
          placeholder={"Search transcript"}
          onChange={search}
          onClear={onClear}
          onlyInput={true}
          styleType={styles["search-input"]}
          inputContainerStyle={styles["input-container"]}
        />
      )}

      <div className={styles["transcript-row"]}>
        {transcriptData.length === 0 && <div>Processing...</div>}
        {transcriptData.map((transcript, index) => {
          return (
            <div key={index} className={styles["transcript-item"]}>
              <span className={styles["time-text"]}>
                {transcript.startTime.split(",")[0]}
              </span>
              <span className={styles["trans-text"]}>{transcript.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetTranscript;

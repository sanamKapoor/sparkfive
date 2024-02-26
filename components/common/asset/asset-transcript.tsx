import React, { useEffect, useState } from 'react';

import dateUtils from "../../../utils/date";

// @ts-ignore
import Search from "../attributes/search-input";
import styles from './asset-transcript.module.css';

const AssetTranscript = ({ title, transcripts, loading = true, navigateToTime = (time) => { } }) => {
  const [transcriptData, setTranscriptData] = useState(transcripts)

  const search = (value) => {
    if (transcripts.transcript) {
      const searchResults = transcripts.transcript.filter(
        (item) => item.text.toLowerCase().indexOf(value.toLowerCase()) > -1,
      );

      setTranscriptData({ ...transcriptData, transcript: searchResults })
    }

  }

  const onClear = () => {

  }

  useEffect(() => {
    setTranscriptData(transcripts)
  }, [transcripts])

  return (
    <div className={`${styles.container}`}>
      <div className={styles.wrapper}>
        <h2>{title}</h2>
      </div>

      {transcriptData?.transcript && <Search placeholder={"Search transcript"}
        onChange={search}
        onClear={onClear}
        onlyInput={true}
        styleType={styles["search-input"]}
        inputContainerStyle={styles["input-container"]} />}

      <div className={styles["transcript-row"]}>
        {loading && <div>Processing...</div>}
        {!loading && (transcriptData?.error || (!transcriptData?.error && transcriptData?.transcript && transcriptData?.transcript.length === 0)) && <div>A transcript does not exist for this video</div>}
        {!loading && !transcriptData?.error && transcriptData?.transcript && transcriptData?.transcript.map((transcript, index) => {
          return <div key={index} className={styles["transcript-item"]}>
            <span className={styles["time-text"]} onClick={() => {
              navigateToTime(dateUtils.getSecondsFromHhMmSs(transcript.startTime.split(",")[0]))
            }}>{transcript.startTime.split(",")[0]}</span>
            <span className={styles["trans-text"]}>{transcript.text}</span>
          </div>
        })}
      </div>

    </div>
  )
}

export default AssetTranscript

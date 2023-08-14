import moment from "moment";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

import SpinnerOverlay from "../../spinners/spinner-overlay";

// APIs
import guestUploadApi from "../../../../server-api/guest-upload";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assets, setAssets] = useState([]);
  const [requestInfo, setRequestInfo] = useState("");

  const getRequests = async () => {
    // Show loading
    setLoading(true);

    let { data } = await guestUploadApi.getRequests({
      isAll: 1,
      sort: "createdAt,asc",
    });

    setRequests(data);

    setLoading(false);
  };

  const getRequestAssets = async (id, requestInfo) => {
    setRequestInfo(requestInfo);

    setLoadingAssets(true);
    setShowReviewModal(true);

    // Call APi to get data
    let { data } = await guestUploadApi.getRequestAssets(id);

    // Set data
    setAssets(data);

    setLoadingAssets(false);
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <>
      {requests.length === 0 && (
        <div className={"row align-center justify-content-center"}>No data</div>
      )}
      {requests.map((request, index) => {
        return (
          <div
            className={`row align-center ${styles["data-row"]} ${
              index === requests.length - 1 ? "" : styles["ghost-line"]
            }`}
            key={index}
          >
            <div className={`col-10 ${styles["time-col"]}`}>
              <p>{moment(request.createdAt).format("MMM DD")}</p>
              <p>{moment(request.createdAt).format("LT")}</p>
            </div>
            <div className={`col-30 ${styles["name-col"]}`}>
              <p>{request.name}</p>
              <p className={styles["description-text"]}>{request.notes}</p>
            </div>
            <div className={"col-10 align-center"}>
              <span
                className={"underline-text pointer"}
                onClick={() => {
                  getRequestAssets(request.id, request);
                }}
              >
                Review
              </span>
            </div>
            <div className={"col-20 align-center"}>
              <span className={"italic-text"}>{request.status}</span>
            </div>
            <div className={"col-30 align-center"}>
              Expires {moment(request.expiredAt).format("MM/DD/YYYY")}
            </div>
          </div>
        );
      })}

      {loading && <SpinnerOverlay />}
    </>
  );
}

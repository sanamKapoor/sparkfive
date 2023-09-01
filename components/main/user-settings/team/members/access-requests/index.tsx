import { useState } from "react";
import { IRequestFormData } from "../../../../../../interfaces/team/team";
import styles from "../../index.module.css";
import RequestAccessList from "./request-access-list";

import requestApi from "../../../../../../server-api/request";

import toastUtils from "../../../../../../utils/toast";
import Base from "../../../../../common/modals/base";
import RequestForm from "./request-form";

interface AccessRequestsProps {
  requests: IRequestFormData[];
  setLoading: (val: boolean) => void;
  getAccessRequest: () => void;
}

const AccessRequests: React.FC<AccessRequestsProps> = ({
  requests,
  setLoading,
  getAccessRequest,
}) => {
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<IRequestFormData>();

  const onRequestChange = async (type: string, request: IRequestFormData) => {
    switch (type) {
      case "review": {
        setSelectedRequest(request);
        break;
      }
      case "accept": {
        setLoading(true);
        await requestApi.approve(request.id, { roleId: request.roleId });
        getAccessRequest();
        toastUtils.success("Approve successfully");
        setSelectedRequest(undefined);
        setLoading(false);
        break;
      }
      case "reject": {
        setLoading(true);
        await requestApi.reject(request.id);
        getAccessRequest();
        toastUtils.success("Reject successfully");
        setSelectedRequest(undefined);
        setLoading(false);
        break;
      }
    }
  };

  return (
    <div className={styles.content}>
      <div className={`${styles["main-headers"]} m-t-40`}>
        <h3>Access Requests</h3>
      </div>
      {requests.length > 0 ? (
        <RequestAccessList
          members={requests}
          type="invite"
          onChange={onRequestChange}
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          setShowReviewModal={setShowReviewModal}
        />
      ) : (
        <p>No requests at the moment.</p>
      )}

      <Base
        modalIsOpen={showReviewModal}
        closeModal={() => {
          setShowReviewModal(false);
        }}
        additionalClasses={[styles["base-plan-modal"]]}
      >
        <RequestForm
          data={selectedRequest}
          onApprove={() => {
            setShowReviewModal(false);
            onRequestChange("accept", selectedRequest);
          }}
          onReject={() => {
            setShowReviewModal(false);
            onRequestChange("reject", selectedRequest);
          }}
        />
      </Base>
    </div>
  );
};

export default AccessRequests;

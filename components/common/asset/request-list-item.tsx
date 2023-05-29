import moment from "moment"

import requestListStyles from "./request-list-item.module.css";
import { Utilities, AssetOps } from "../../../assets";

// Components
import AssetImg from "./asset-img";
import IconClickable from "../buttons/icon-clickable";
import AssetIcon from "./asset-icon";
import RequestStatusBadge from "./RequestStatusBadge";

const RequestListItem = ({
handleDeleteApproval,
  data: {
    assets,
    id,
    name = "",
    user = {},
    status = 0,
    isLoading = false,
    isSelected,
    createdAt = new Date(),
    uploadType,
  },
  index,
  toggleSelected = () => { },
  onView = (index) => { },
  isAdmin = false
}) => {

  const getThumbnail = (asset) => {
    if (asset) {
      const { thumbailUrl, asset: { extension } } = asset
      return thumbailUrl ? (
        <AssetImg
          imgClass={requestListStyles.thumbnail}
          assetImg={thumbailUrl}
          type={""}
          name={name}
        />
      ) : (
        <AssetIcon extension={extension} onList={true} />
      )
    } else {
      return <AssetIcon extension={""} onList={true} />
    }
  }



  return (
    <>
      <div className={requestListStyles.list}>
        {index === 0 && (
          <div className={requestListStyles.header}>
            <h4> </h4>
            <div className={requestListStyles["headers-content"]}>
              <h4>
                Batch Name
              </h4>
              {/*<h4>Stage</h4>*/}
              {isAdmin && <h4>
                Submitted By
              </h4>}
              <h4>
                Date
                <IconClickable src={Utilities.sort} />
              </h4>
              <h4>
                Status
              </h4>
              <h4>
                Admin Actions
              </h4>
            </div>
          </div>
        )}
        <div className={requestListStyles.item}>
          <div className={requestListStyles.photo}>
            <div
              className={`${requestListStyles["selectable-wrapper"]} ${isSelected && requestListStyles["selected-wrapper"]
                }`}
            >
              {!isLoading && (
                <>
                  {isSelected ? (
                    <IconClickable
                      src={Utilities.radioButtonEnabled}
                      additionalClass={requestListStyles["select-icon"]}
                      onClick={toggleSelected}
                    />
                  ) : (
                    <IconClickable
                      src={Utilities.radioButtonNormal}
                      additionalClass={requestListStyles["select-icon"]}
                      onClick={toggleSelected}
                    />
                  )}
                </>
              )}
            </div>
            <div className={`${requestListStyles.thumbnail} ${isLoading && "loadable"}`}>
            </div>
          </div>
          <div className={requestListStyles.info}>
            <div
              className={`${requestListStyles.field_name} ${isLoading && "loadable"} align-center`}
            >
              {getThumbnail(assets[0])}
              <span>{(uploadType === 'approval' ? name : `${name} - Guest Upload`) || "Untitled"}</span>
              <div className={requestListStyles.field_mobile}>
                {isAdmin && <div className={`${requestListStyles.field_author_mobile} ${isLoading && "loadable"} font-weight-500`}>
                  {user?.name}
                </div>}
                <div className={requestListStyles.field_time_mobile}>
                  {moment(createdAt).format("MMM DD, YYYY")}
                </div>
                <div className={requestListStyles.field_status_mobile}>
                  <RequestStatusBadge status={status} uploadType={uploadType} isAdmin={isAdmin}/>
                </div>
              </div>
            </div>
            {isAdmin && <div className={`${requestListStyles.field_author} ${isLoading && "loadable"} font-weight-500`}>
              {user?.name}
            </div>}
            <div className={requestListStyles.field_time}>
              {moment(createdAt).format("MMM DD, YYYY hh:mm a")}
            </div>
            <div className={requestListStyles.field_status}>
            <RequestStatusBadge status={status} uploadType={uploadType} isAdmin={isAdmin}/>
            </div>
            <div className={`${requestListStyles.field_actions} ${isLoading && "loadable"}`}>
              <span className={"underline-text cursor-pointer"} onClick={() => { onView(index) }}>View Batch</span>
              <IconClickable src={AssetOps.deleteGray} onClick={() => handleDeleteApproval({assets, id}, uploadType)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestListItem;

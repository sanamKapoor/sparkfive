import moment from "moment"

import requestListStyles from "./request-list-item.module.css";
import { Utilities, Assets } from "../../../assets";

// Components
import AssetImg from "./asset-img";
import IconClickable from "../buttons/icon-clickable";
import AssetIcon from "./asset-icon";

const RequestListItem = ({
  data: {
    assets,
    name = "",
    user = {},
    status = 0,
    isLoading = false,
    isSelected,
      createdAt = new Date()
  },
  index,
  toggleSelected = () => {},
  onView = (index) => {},
  isAdmin = false
}) => {


  const Tag = ({ status }) => {
    switch (status){
      case -1: {
        return <span className={requestListStyles['pending-tag']}>Rejected</span>
      }
      case 0: {
        return <span className={requestListStyles['pending-tag']}>Pending</span>
      }
      case 1: {
        // Admin role will see submitted tag as pending
        if(isAdmin){
          return <span className={requestListStyles['pending-tag']}>Pending</span>
        }else{
          return <span className={requestListStyles['complete-tag']}>Submitted</span>
        }

      }
      case 2: {
        return <span className={requestListStyles['complete-tag']}>Completed</span>
      }
      default : {
        return <span className={requestListStyles['pending-tag']}>Pending</span>
      }
    }

  }

  const getThumbnail = (asset) => {
    if(asset){
      const { thumbailUrl,  extension} = asset
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
    }else{
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
                Upload Name
              </h4>
              {/*<h4>Stage</h4>*/}
              <h4>
                Submitted By
              </h4>
              <h4>
                Time
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
              className={`${requestListStyles["selectable-wrapper"]} ${
                isSelected && requestListStyles["selected-wrapper"]
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
              className={`${requestListStyles.name} ${isLoading && "loadable"} align-center`}
            >
              {getThumbnail(assets[0])}
              <span className={"font-weight-500"}>Test0</span>
            </div>
            <div className={`${requestListStyles.field_name} ${isLoading && "loadable"} font-weight-500`}>
              {user?.name}
            </div>
            <div className={requestListStyles.field_time}>
              {moment(createdAt).format("MMM DD, YYYY hh:mm a")}
            </div>
            <div className={requestListStyles.field_name}>
              <Tag status={status}/>
            </div>
            <div className={`${requestListStyles.field_name} ${isLoading && "loadable"}`}>
              <span className={"underline-text cursor-pointer"} onClick={()=>{onView(index)}}>View Batch</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestListItem;

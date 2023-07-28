import { format } from "date-fns";
import Router from "next/router";
import { Utilities } from "../../../../assets";
import styles from "./list-item.module.css";

// Components
import Button from "../../../common/buttons/button";
import Dropdown from "../../../common/inputs/dropdown";
import StatusBadge from "../../../common/misc/status-badge";
import ToggleableAbsoluteWrapper from "../../../common/misc/toggleable-absolute-wrapper";
import Type from "../../../common/misc/type";
import UserPhoto from "../../../common/user/user-photo";

const ListItem = ({ item }) => {
  const wasUpdated = item.createdAt !== item.updatedAt;
  const dateFormat = "MMM do, yyyy h:mm a";
  const createdAt = format(new Date(item.createdAt), dateFormat);
  const updatedAt = format(new Date(item.updatedAt), dateFormat);

  let itemTime;
  let parent;

  if (item.itemType === "project") {
    if (item.campaign) {
      parent = `Campaign: ${item.campaign.name}`;
    }
    if (item.publishDate) {
      itemTime = format(new Date(item.publishDate), "h:mm a");
    }
  } else if (item.itemType === "task") {
    if (item.project) {
      parent = `Project: ${item.project.name}`;
    }
    if (item.endDate) {
      itemTime = format(new Date(item.endDate), "h:mm a");
    }
  } else {
    if (item.endDate) {
      itemTime = format(new Date(item.endDate), "h:mm a");
    }
  }

  const owner = item.users?.find((user) => user.isOwner);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        {parent && (
          <div className={styles["info-date"]}>
            <span>{parent}</span>
          </div>
        )}
        {wasUpdated ? (
          <div className={styles["info-date"]}>
            <span> Edited {updatedAt}</span>
          </div>
        ) : (
          <div className={styles["info-date"]}>
            <span> Created {createdAt}</span>
          </div>
        )}
      </div>
      <div className={styles.status}>
        <StatusBadge status={item.status} />
      </div>
      <div className={styles.type}>
        <Type item={item} />
      </div>
      <div className={styles.time}>{itemTime}</div>
      <div className={styles.owner}>
        <UserPhoto photoUrl={owner?.profilePhoto} sizePx={20} />
        <span>{owner?.name}</span>
      </div>
      <div className={styles.action}>
        <Button
          text="Edit"
          type="button"
          className="container primary"
          onClick={() => Router.replace(`/main/${item.itemType}s/${item.id}`)}
        />
        {item.dropdownOpts.length > 0 && (
          <ToggleableAbsoluteWrapper
            wrapperClass={`${styles["more-task"]}`}
            contentClass={styles.dropdown}
            Wrapper={({ children }) => (
              <>
                <img src={Utilities.more} />
                {children}
              </>
            )}
            Content={() => {
              return <Dropdown options={item.dropdownOpts} />;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ListItem;

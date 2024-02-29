import { format } from "date-fns";
import Highlighter from "react-highlight-words";
import styles from "./comment.module.css";

// Components
import UserPhoto from "../user/user-photo";

const Comment = ({ content, mentions, createdAt, user }) => {
  const mentionNames = mentions.map((mention) => `@${mention.name}`);

  return (
    <div className={styles.container}>
      <div className={styles["main-content"]}>
        <UserPhoto
          sizePx={28}
          photoUrl={user.profilePhoto}
          extraClass={styles["author-img"]}
        />
        <div className={styles["author-date"]}>
          <span>{user.name}</span>
          <span>{format(new Date(createdAt), "MMM Mo p")}</span>
        </div>
      </div>
      <Highlighter
        highlightClassName={styles.mention}
        searchWords={mentionNames}
        autoEscape={true}
        textToHighlight={content}
        style={{ fontSize: 14, color: "#817D9D" }}
      />
    </div>
  );
};

export default Comment;

import styles from "../chat.module.css";

const MessageBubble = ({ msg }) => {
  const isDriver = msg.sender === "driver";

  return (
    <div className={`${styles.msgRow} ${isDriver ? styles.driver : ""}`}>
      <div
        className={`${styles.msgBubble} ${
          isDriver ? styles.driverBubble : styles.adminBubble
        }`}
      >
        {msg.type === "text" && msg.content}
        {msg.type === "image" && <img src={msg.content} width="140" />}
        {msg.type === "file" && <a href={msg.content}>Download</a>}
      </div>
    </div>
  );
};

export default MessageBubble;

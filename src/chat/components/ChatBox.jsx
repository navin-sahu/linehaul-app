import styles from "../chat.module.css";
import AttachmentPicker from "./AttachmentPicker";
import MessageBubble from "./MessageBubble";

const ChatBox = ({ title, messages, embedded = false }) => {
  return (
    <div
      className={styles.chatBox}
      style={
        embedded
          ? {
              position: "relative",
              bottom: "auto",
              right: "auto",
              width: "100%",
              height: "100%",
              boxShadow: "none",
              borderRadius: 0
            }
          : {}
      }
    >
      <div className={styles.chatHeader}>{title}</div>

      <div className={styles.chatBody}>
        {messages.map(m => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className={styles.chatFooter}>
        <AttachmentPicker />
        <input type="text" placeholder="Type message..." />
        <button className={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

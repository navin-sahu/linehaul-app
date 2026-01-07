import { FiPaperclip } from "react-icons/fi";
import styles from "../chat.module.css";
const AttachmentPicker = () => {
  return (
    <>
      <label className={styles.AttachmentPicker}>
        <FiPaperclip size={18} />
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          style={{ display: "none" }}
        />
      </label>
    </>
  );
};

export default AttachmentPicker;

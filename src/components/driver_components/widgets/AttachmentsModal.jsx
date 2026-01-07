import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Modal from "../../admin_components/widgets/Modal";
import UploadPOD from "./UploadPOD";
import UploadDocs from "./UploadDocs";
import { getDocs, getPods, removeDoc, removePod } from "./AttachmentsStore";
import styles from "../css/AttachmentsModal.module.css";

const AttachmentsModal = ({ open, jobId, onClose }) => {
  // 🔑 simple render trigger (no effect, no warning)
  const [version, setVersion] = useState(0);

  const docs = useMemo(
    () => (open ? getDocs(jobId) : []),
    [open, jobId, version]
  );

  const pods = useMemo(
    () => (open ? getPods(jobId) : []),
    [open, jobId, version]
  );

  const refresh = () => {
    setVersion(v => v + 1); // ✅ re-render only
  };

  return (
    <Modal
      open={open}
      title="Attachments"
      onClose={onClose}
      actions={
        <>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`${styles.primaryBtn} ${styles.mtZero}`}
            onClick={onClose}
          >
            Done
          </button>
        </>
      }
    >
      {/* ---------------- POD UPLOAD ---------------- */}
      <div className={styles.section}>
        <label className={styles.label}>POD Images</label>
        <UploadPOD jobId={jobId} onUploaded={refresh} />

        {pods.length > 0 && (
          <div className={styles.previewGrid}>
            {pods.map((img, i) => (
              <div key={i} className={styles.previewItem}>
                <img src={img} alt={`POD ${i + 1}`} />
                <button
                  type="button"
                  onClick={() => {
                    removePod(jobId, i);
                    refresh();
                  }}
                  title="Remove"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- DOC UPLOAD ---------------- */}
      <div className={styles.section}>
        <label className={styles.label}>Documents</label>
        <UploadDocs jobId={jobId} onUploaded={refresh} />

        {docs.length > 0 && (
          <ul className={styles.fileList}>
            {docs.map((d, i) => (
              <li key={i}>
                <span>{d}</span>
                <button
                  type="button"
                  onClick={() => {
                    removeDoc(jobId, i);
                    refresh();
                  }}
                  title="Remove"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default AttachmentsModal;

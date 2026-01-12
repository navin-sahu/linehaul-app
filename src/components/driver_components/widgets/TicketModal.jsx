import { useState } from "react";
import Modal from "../../admin_components/widgets/Modal";
import styles from "../css/TicketModal.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { driverApi } from "@/api"

const TicketModal = ({ open, jobId, onClose }) => {
  const [issueType, setIssueType] = useState("COMMENT");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

    const queryClient = useQueryClient();
  
    const createIssueMutation = useMutation({
      mutationFn: ({driverId, entryId, data}) => 
        driverApi.updateEntryIssueByDriverId(driverId, entryId, data),
  
      onSuccess: () => {
        queryClient.invalidateQueries(["entries", issueType])
      }
    })

  const submitTicket = () => {
    if (!message.trim()) {
      alert("Please enter a comment or issue");
      return;
    }

    // const formData = new FormData();
    // formData.append("jobId", jobId);
    // formData.append("issueType", issueType);
    // formData.append("message", message);

    // files.forEach((file) => {
    //   formData.append("files", file);
    // });

    // console.log({
    //   jobId,
    //   issueType,
    //   message,
    //   files
    // });
    
    createIssueMutation.mutate({
      driverId: JSON.parse(localStorage.getItem('user')).id,
      entryId: jobId,
      data: {
        issueType,
        message
      }
    })

    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add Comment / Issue"
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
            onClick={submitTicket}
          >
            Submit
          </button>
        </>
      }
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Issue Type</label>
        <select
          className={styles.select}
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        >
          <option value="COMMENT">Comment</option>
          <option value="DELAY">Delay</option>
          <option value="DAMAGE">Damage</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Documents</label>
        <input
          type="file"
          multiple
           accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setFiles([...e.target.files])} 
        />
        {files.length > 0 && (
          <div className={styles.helper}>
            {files.length} {files.length === 1 ? " file" : " files" } selected
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Message</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe the issue or add a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.helper}>
          Be clear and concise. This will be visible to admins.
        </div>
      </div>
    </Modal>
  );
};

export default TicketModal;
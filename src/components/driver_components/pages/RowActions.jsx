import { useEffect, useState } from "react";
import { FiPaperclip, FiAlertCircle } from "react-icons/fi";
import TicketModal from "../widgets/TicketModal";
import AttachmentsModal from "../widgets/AttachmentsModal";
import styles from "../css/EntriesViewer.module.css";


const RowActions = ({ row }) => {
  const [filesOpen, setFilesOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);




  /* ---------------- LOCK BODY SCROLL ---------------- */
  useEffect(() => {
    if (filesOpen || ticketOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => (document.body.style.overflow = "");
  }, [filesOpen, ticketOpen]);

  return (
    <div className={styles.actionsCell}>
      {/* 📎 Attachments */}
     
      <button
        className={styles.iconBtn}
        title="Attachments"
        onClick={() => setFilesOpen(true)}
      >
        <FiPaperclip size={18} />
      </button>

      {/* ⚠️ Ticket */}
      <button
        className={styles.iconBtn}
        title="Raise Issue"
        onClick={() => setTicketOpen(true)}
      >
        <FiAlertCircle size={18} />
      </button>

      <AttachmentsModal
        open={filesOpen}
        jobId={row.jobId}
        onClose={() => setFilesOpen(false)}
      />

      <TicketModal
        open={ticketOpen}
        jobId={row}
        onClose={() => setTicketOpen(false)}
      />
    </div>
  );
};

export default RowActions;

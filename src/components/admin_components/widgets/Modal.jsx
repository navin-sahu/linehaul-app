import styles from "../css/Modals.module.css";

const Modal = ({ open, title, children, actions, onClose }) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalBox}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3>{title}</h3>}

        {children}

        {actions && (
          <div className={styles.modalActions}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
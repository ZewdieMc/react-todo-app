import React from 'react';
import PropTypes from 'prop-types';
import styles from 'styles/ConfirmModal.module.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <p>{message}</p>
      <div className={styles.modalActions}>
        <button type="button" onClick={onConfirm} className={styles.confirmButton}>
          Confirm
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

ConfirmModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;

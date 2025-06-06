import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, onHide, onConfirm, title, bodyText, confirmText = "Confirm", cancelText = "Cancel" }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmation"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText || "Are you sure you want to proceed?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;

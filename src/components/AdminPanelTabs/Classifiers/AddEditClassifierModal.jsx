import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AddEditClassifierModal({
  show,
  onHide,
  type,       // “categories”, “designers”, etc.
  initial,    // null for add, or { id, name } for edit
  onSave      // ( { id?, name } ) => Promise<boolean>
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(initial?.name || '');
  }, [initial]);

  const handleSubmit = async () => {
    const ok = await onSave({
      id: initial?.id,
      name: name.trim(),
    });
    if (ok) onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {initial ? `Edit ${type.slice(0, -1)}` : `Add ${type.slice(0, -1)}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control 
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          {initial ? 'Save' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useNotifications } from '../../NotificationsHandling/NotificationContext';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import AddEditClassifierModal from './AddEditClassifierModal';
import {
  getClassifiers,
  createClassifier,
  updateClassifier,
  deleteClassifier
} from '../../../api/сlassifiersApi';

export default function ClassifierSubTab({ type, label, singleLabel }) {

  const { addNotification } = useNotifications();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setLoading(true);
    getClassifiers(type).then(res => {
      if (res.success) setItems(res.data);
      else addNotification({message: "An error occured while retrieving classifiers", variant: 'danger' });
      setLoading(false);
      setPage(1);
      setSearchTerm('');
    });
  }, [type]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  const handleSave = async ({ id, name }) => {
    let res;
    if (id) {
      res = await updateClassifier(type, id, { id, name });
      if (res.success) {
        addNotification({ message: `${singleLabel} updated`, variant: 'success' });
        const updated = await getClassifiers(type);
        if (updated.success) setItems(updated.data)
        else addNotification({message: "An error occured while retrieving classifiers", variant: 'danger' });
      }
    } else {
      res = await createClassifier(type, { name });
      if (res.success) {
        const newItem = { id: Date.now(), name };
        setItems([newItem, ...items]);
        addNotification({ message: `${singleLabel} created`, variant: 'success' });
      }
    }
    if (!res.success) {
      addNotification({ message: "An error occured while saving", variant: 'danger' });
    }
    return res.success;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const res = await deleteClassifier(type, id);
    if (res.success) {
      setItems(items.filter(i => i.id !== id));
      addNotification({ message: `${singleLabel} deleted`, variant: 'success' });
    } else {
      addNotification({ message: "An error occured while deleting", variant: 'danger' });
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <div className="d-flex justify-content-between mb-2 gap-2">
        <SearchBar
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
          placeholder={`Search ${label}`}
        />
        <Button className="add-classifier-button" onClick={() => { setEditing(null); setShowModal(true); }}>
          Add {singleLabel}
        </Button>
      </div>

      {paginated.length === 0
        ? <p>No {label.toLowerCase()} found.</p>
        : (
          <>
            <div className="item-list">
              {paginated.map(item => (
                <div className="item-card" key={item.id}>
                  <div className="item-name">{item.name}</div>
                  <div className="item-actions">
                    <button
                      className="btn edit-btn"
                      onClick={() => { setEditing(item); setShowModal(true) }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )
      }

      <AddEditClassifierModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={type}
        initial={editing}
        onSave={handleSave}
      />
    </>
  );
}
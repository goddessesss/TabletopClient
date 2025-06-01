import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { changeUserRole, getAllUsers } from '../../../api/usersApi';
import { roles } from '../../../enums/roles'
import { useNotifications } from '../../NotificationsHandling/NotificationContext';

function UsersAdminPanel() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async() => {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data);
      }
    }

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    const currentRole = roles.find(r => r.id === user.role);
    setSelectedRoleId(currentRole?.id ?? null);
    setShowModal(true);
  };

  const handleSaveRole = async () => {
    if (selectedUser && selectedRoleId !== null) {
      const res = await changeUserRole(selectedUser.id, selectedRoleId);
      if (res.success) {
        const updatedRole = roles.find(r => r.id === selectedRoleId)?.name;
        await fetchUsers();
        addNotification({message: 'User role successfully updated', variant:'success'})
      }
      else{
        addNotification({message: 'An error occured while updating role', variant:'danger'})
      }
      setShowModal(false);
    }
  };

  return (
    <div className="admin-users-page">
      <h2 className="mb-4">User Management</h2>
      <div className="table-responsive">
        <Table striped bordered hover className="user-table align-middle">
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Google ID</th>
              <th>Email Confirmed</th>
              <th>Role</th>
              <th>Language</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.phoneNumber || '—'}</td>
                <td>{user.googleId || '—'}</td>
                <td>
                  {user.isEmailConfirmed ? (
                    <span className="text-success">Yes</span>
                  ) : (
                    <span className="text-danger">No</span>
                  )}
                </td>
                <td>{user.roleName}</td>
                <td>{user.languageIso}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleOpenModal(user)}
                  >
                    Change Role
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Current Role:</strong> {selectedUser.roleName}</p>
              <Form.Group>
                <Form.Label>Select New Role</Form.Label>
                <Form.Select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveRole}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsersAdminPanel;
import React, { useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

// User Form Component to handle add/edit user form
const UserForm = ({ user, onChange, onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <Form.Group controlId="userName">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter name"
        value={user.name}
        onChange={(e) => onChange('name', e.target.value)}
        required
      />
    </Form.Group>
    <Form.Group controlId="userEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter email"
        value={user.email}
        onChange={(e) => onChange('email', e.target.value)}
        required
      />
    </Form.Group>
    <Form.Group controlId="userAddress">
      <Form.Label>Address</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter address"
        value={user.address}
        onChange={(e) => onChange('address', e.target.value)}
        required
      />
    </Form.Group>
    <Form.Group controlId="userDob">
      <Form.Label>Date of Birth</Form.Label>
      <Form.Control
        type="date"
        value={user.dob}
        onChange={(e) => onChange('dob', e.target.value)}
        required
      />
    </Form.Group>
    <Form.Group controlId="userGender">
      <Form.Label>Gender</Form.Label>
      <Form.Control
        as="select"
        value={user.gender}
        onChange={(e) => onChange('gender', e.target.value)}
        required
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </Form.Control>
    </Form.Group>
    <Form.Group controlId="userStatus">
      <Form.Label>Status</Form.Label>
      <Form.Control
        as="select"
        value={user.status}
        onChange={(e) => onChange('status', e.target.value)}
        required
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </Form.Control>
    </Form.Group>
    <Form.Group controlId="userRole">
      <Form.Label>Role</Form.Label>
      <Form.Control
        as="select"
        value={user.role}
        onChange={(e) => onChange('role', e.target.value)}
        required
      >
        <option value="psychologist">Psychologist</option>
        <option value="admin">Admin</option>
        <option value="patient">Patient</option>
      </Form.Control>
    </Form.Group>
    <Button variant="primary" type="submit">
      {user.id ? 'Save Changes' : 'Add User'}
    </Button>
  </Form>
);

const ManageUsers = () => {
  // State for users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', address: '123 Main St, Cityville', dob: '1985-06-15', gender: 'Male', status: 'Active', role: 'patient' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', address: '456 Elm St, Townsville', dob: '1990-09-25', gender: 'Female', status: 'Inactive', role: 'admin' },
  ]);

  // State for Modal
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '', address: '', dob: '', gender: '', status: '', role: '' });

  // Handle form input changes
  const handleChange = (field, value) => {
    setEditUser(prevUser => ({ ...prevUser, [field]: value }));
  };

  // Handle add/edit user form submission
  const handleFormSubmit = useCallback((event) => {
    event.preventDefault();
    if (editUser.id) {
      // Edit existing user
      setUsers(users.map(user => user.id === editUser.id ? editUser : user));
    } else {
      // Add new user
      const newUser = { id: Date.now(), ...editUser };
      setUsers([...users, newUser]);
    }
    resetForm();
    setShowModal(false);
  }, [editUser, users]);

  // Handle delete user
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Open modal for adding new user or editing
  const handleShowModal = (user = { id: '', name: '', email: '', address: '', dob: '', gender: '', status: '', role: '' }) => {
    setEditUser(user);
    setShowModal(true);
  };

  // Reset form state
  const resetForm = () => {
    setEditUser({ id: '', name: '', email: '', address: '', dob: '', gender: '', status: '', role: '' });
  };

  return (
    <div className="container mt-5">
      <h2>Manage Users</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add User
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.dob}</td>
              <td>{user.gender}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(user)}>
                  Edit
                </Button>
                <Button variant="danger" className="ml-2" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit User */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser.id ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm user={editUser} onChange={handleChange} onSubmit={handleFormSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageUsers;

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const UserForm = ({ user, onChange, onSubmit }) => { 
  const [dobError, setDobError] = useState("");

  const handleDateChange = (field, value) => {
    const today = new Date().toISOString().split("T")[0];
    if (value > today) {
      setDobError("Date of Birth cannot be in the future.");
    } else {
      setDobError("");
    }
    onChange(field, value);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={user.fullName} onChange={(e) => onChange('fullName', e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="name">
        <Form.Label>Password</Form.Label>
        <Form.Control type="text" value={user.password} onChange={(e) => onChange('password', e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={user.email} onChange={(e) => onChange('email', e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" value={user.address} onChange={(e) => onChange('address', e.target.value)} required/>
      </Form.Group>
      <Form.Group controlId="dob">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control type="date" value={user.dob} onChange={(e) => handleDateChange('dob', e.target.value)} required/>
        {dobError && <Form.Text className="text-danger">{dobError}</Form.Text>}
      </Form.Group>
      <Form.Group controlId="gender">
        <Form.Label>Gender</Form.Label>
        <Form.Control as="select" value={user.gender} onChange={(e) => onChange('gender', e.target.value)}required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="status">
        <Form.Label>Status</Form.Label>
        <Form.Control as="select" value={user.status} onChange={(e) => onChange('status', e.target.value)}required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="role">
        <Form.Label>Role</Form.Label>
        <Form.Control as="select" value={user.role} onChange={(e) => onChange('role', e.target.value)}required>
          <option value="">Select</option>
          <option value="Psychologist">Psychologist</option>
          <option value="Patient">Patient</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3" disabled={dobError}>Save</Button>
    </Form>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', address: '', dob: '', gender: '', status: 'Active', role: '',password: '' });

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/allaccount')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddUser = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/addaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add user');
      }
  
      setUsers([...users, data.user]);
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };
  
  return (
    <div className="container mt-5">
      <h2>Manage Users</h2>
      <Button variant="primary" onClick={handleAddUser}>Add User</Button>
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
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.dob}</td>
              <td>{user.gender}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning">Edit</Button>
                <Button variant="danger" className="ms-2">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm user={newUser} onChange={handleChange} onSubmit={handleSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageUsers;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import Modal from '../components/common/Modal';
import { Users, Search, Edit2, Trash2, Shield, UserX, UserCheck } from 'lucide-react';

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit user modal
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'guest', phone: '', isBlocked: false });
  const [updating, setUpdating] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userService
      .getAllUsers({ role: roleFilter, search: searchTerm })
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openEdit = (user) => {
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      isBlocked: !!user.isBlocked
    });
    setEditModal({ open: true, user });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editModal.user) return;

    setUpdating(true);
    try {
      const res = await userService.updateUser(editModal.user._id, editForm);
      if (res.success) {
        setSuccess(`User "${editForm.name}" updated successfully.`);
        setEditModal({ open: false, user: null });
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleting(true);
    try {
      const res = await userService.deleteUser(deleteModal.user._id);
      if (res.success) {
        setSuccess(`User "${deleteModal.user.name}" deleted successfully.`);
        setDeleteModal({ open: false, user: null });
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Registered Users</h1>
          <p className="page-description">
            Assign user roles, modify permissions, suspend accounts, and manage registrations.
          </p>
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--border-color)' }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'guest', 'hotel_manager', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {r === 'hotel_manager' ? 'Hotel Manager' : r}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            style={{ width: '240px', padding: '6px 12px', fontSize: '0.9rem' }}
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            <Search size={14} />
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving platform user accounts..." />
      ) : users.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div>
                      <strong>{u.name}</strong>
                      {u._id === currentUser?._id && (
                        <span style={{ fontSize: '0.72rem', marginLeft: '6px', color: 'var(--primary)', fontWeight: 700 }}>
                          (You)
                        </span>
                      )}
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${u.role === 'hotel_manager' ? 'manager' : u.role}`}>
                      {u.role === 'hotel_manager' ? 'Hotel Manager' : u.role}
                    </span>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    {u.isBlocked ? (
                      <span className="badge" style={{ backgroundColor: 'var(--danger-light)', color: '#991b1b' }}>
                        Suspended
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'var(--success-light)', color: '#065f46' }}>
                        Active
                      </span>
                    )}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(u)} className="btn btn-secondary btn-sm" title="Edit Permissions">
                        <Edit2 size={14} />
                      </button>
                      {u._id !== currentUser?._id && (
                        <button
                          onClick={() => setDeleteModal({ open: true, user: u })}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Users size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3>No Users Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No matching users for this filter.</p>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title={`Edit User: ${editModal.user?.name}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role Authorization</label>
            <select
              className="form-control"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="guest">Guest</option>
              <option value="hotel_manager">Hotel Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-control"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="isBlocked"
              checked={editForm.isBlocked}
              onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="isBlocked" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Suspend / Block Account Access
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setEditModal({ open: false, user: null })}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User Account"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Are you sure you want to permanently delete account <strong>{deleteModal.user?.name}</strong> ({deleteModal.user?.email})?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setDeleteModal({ open: false, user: null })}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

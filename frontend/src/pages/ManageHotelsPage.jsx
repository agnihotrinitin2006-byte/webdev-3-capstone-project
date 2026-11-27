import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hotelService } from '../services/hotelService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import Modal from '../components/common/Modal';
import { Building, PlusCircle, Edit2, Trash2, BedDouble, Eye, MapPin } from 'lucide-react';

export default function ManageHotelsPage() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, hotel: null });
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editModal, setEditModal] = useState({ open: false, hotel: null });
  const [editForm, setEditForm] = useState({ name: '', city: '', address: '', description: '', phone: '', email: '' });
  const [updating, setUpdating] = useState(false);

  const fetchHotels = () => {
    setLoading(true);
    const apiCall = user?.role === 'admin' ? hotelService.getHotels() : hotelService.getMyHotels();

    apiCall
      .then((res) => {
        if (res.success) {
          setHotels(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to fetch hotels'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.hotel) return;
    setDeleting(true);
    try {
      const res = await hotelService.deleteHotel(deleteModal.hotel._id);
      if (res.success) {
        setSuccess(`Hotel "${deleteModal.hotel.name}" and its rooms were deleted.`);
        setDeleteModal({ open: false, hotel: null });
        fetchHotels();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete hotel');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (hotel) => {
    setEditForm({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
      phone: hotel.phone || '',
      email: hotel.email || ''
    });
    setEditModal({ open: true, hotel });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editModal.hotel) return;
    setUpdating(true);
    try {
      const res = await hotelService.updateHotel(editModal.hotel._id, editForm);
      if (res.success) {
        setSuccess('Hotel updated successfully');
        setEditModal({ open: false, hotel: null });
        fetchHotels();
      }
    } catch (err) {
      setError(err.message || 'Failed to update hotel');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Hotel Properties</h1>
          <p className="page-description">
            {user?.role === 'admin' ? 'System-wide hotel directory' : 'Your registered hotels and resorts'}
          </p>
        </div>

        <Link to="/manager/hotels/add" className="btn btn-primary">
          <PlusCircle size={16} /> Add New Hotel
        </Link>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {loading ? (
        <LoadingSpinner text="Loading property listings..." />
      ) : hotels.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Room Types</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={h.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}
                        alt={h.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong>{h.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ID: {h._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                      <MapPin size={14} color="#0284c7" /> {h.city}, {h.country || 'USA'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {h.rooms ? h.rooms.length : 0} configured
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                      ★ {h.rating || 4.5}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/hotels/${h._id}`} className="btn btn-secondary btn-sm" title="Public View">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => openEdit(h)} className="btn btn-secondary btn-sm" title="Edit Hotel">
                        <Edit2 size={14} />
                      </button>
                      <Link to={`/manager/rooms?hotelId=${h._id}`} className="btn btn-outline btn-sm" title="Manage Rooms">
                        <BedDouble size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, hotel: h })}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Building size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3>No Hotels Listed Yet</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
            Get started by adding your first luxury accommodation.
          </p>
          <Link to="/manager/hotels/add" className="btn btn-primary">
            <PlusCircle size={16} /> Add First Hotel
          </Link>
        </div>
      )}

      {/* Edit Hotel Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, hotel: null })}
        title={`Edit ${editModal.hotel?.name}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Hotel Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-control"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setEditModal({ open: false, hotel: null })}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Hotel Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, hotel: null })}
        title="Delete Hotel Confirmation"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Are you sure you want to delete <strong>{deleteModal.hotel?.name}</strong>?
          <br />
          <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
            Warning: This action will permanently remove the hotel and all its associated room types.
          </span>
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setDeleteModal({ open: false, hotel: null })}
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
            {deleting ? 'Deleting...' : 'Delete Hotel'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

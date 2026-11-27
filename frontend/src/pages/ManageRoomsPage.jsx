import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import Modal from '../components/common/Modal';
import { BedDouble, PlusCircle, Edit2, Trash2, Users, DollarSign } from 'lucide-react';

export default function ManageRoomsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedHotelId = searchParams.get('hotelId') || '';

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(preselectedHotelId);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Room Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roomForm, setRoomForm] = useState({
    hotel: preselectedHotelId,
    roomType: 'Deluxe Room',
    description: 'Spacious guest room with premium bedding and luxury bathroom.',
    pricePerNight: 200,
    capacity: 2,
    totalQuantity: 5,
    bedType: 'King Bed',
    amenities: 'Free Wi-Fi, Air Conditioning, Flat Screen TV, Mini Fridge'
  });

  // Edit Room Modal State
  const [editModal, setEditModal] = useState({ open: false, room: null });
  const [editForm, setEditForm] = useState({
    roomType: '',
    description: '',
    pricePerNight: 0,
    capacity: 2,
    totalQuantity: 1,
    bedType: ''
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [deleting, setDeleting] = useState(false);

  // Load hotels for dropdown
  useEffect(() => {
    const fetchHotels = user?.role === 'admin' ? hotelService.getHotels() : hotelService.getMyHotels();
    fetchHotels
      .then((res) => {
        if (res.success) {
          setHotels(res.data);
          if (!selectedHotel && res.data.length > 0) {
            setSelectedHotel(res.data[0]._id);
            setRoomForm((p) => ({ ...p, hotel: res.data[0]._id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Load rooms when selectedHotel changes
  const fetchRooms = () => {
    setLoading(true);
    roomService
      .getRooms(selectedHotel)
      .then((res) => {
        if (res.success) {
          setRooms(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to fetch rooms'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedHotel]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.hotel || !roomForm.roomType || !roomForm.pricePerNight) {
      return setError('Please fill in hotel, room type, and price.');
    }

    setSubmitting(true);
    try {
      const amenitiesArr = roomForm.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const res = await roomService.createRoom({
        ...roomForm,
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        totalQuantity: Number(roomForm.totalQuantity),
        amenities: amenitiesArr
      });

      if (res.success) {
        setSuccess('Room type created successfully');
        setAddModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (room) => {
    setEditForm({
      roomType: room.roomType,
      description: room.description || '',
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      totalQuantity: room.totalQuantity,
      bedType: room.bedType || 'King Bed'
    });
    setEditModal({ open: true, room });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editModal.room) return;
    setSubmitting(true);
    try {
      const res = await roomService.updateRoom(editModal.room._id, editForm);
      if (res.success) {
        setSuccess('Room updated successfully');
        setEditModal({ open: false, room: null });
        fetchRooms();
      }
    } catch (err) {
      setError(err.message || 'Failed to update room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteModal.room) return;
    setDeleting(true);
    try {
      const res = await roomService.deleteRoom(deleteModal.room._id);
      if (res.success) {
        setSuccess('Room removed successfully');
        setDeleteModal({ open: false, room: null });
        fetchRooms();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete room');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Room Types & Inventory</h1>
          <p className="page-description">
            Configure room classifications, pricing, capacity, and total inventory quantity.
          </p>
        </div>

        <button
          onClick={() => {
            setRoomForm((p) => ({ ...p, hotel: selectedHotel || (hotels[0]?._id || '') }));
            setAddModalOpen(true);
          }}
          className="btn btn-primary"
          disabled={hotels.length === 0}
        >
          <PlusCircle size={16} /> Add Room Type
        </button>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Hotel Selector Bar */}
      <div style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-color)' }}>
        <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Filter by Property:
        </label>
        <select
          className="form-control"
          style={{ maxWidth: '350px' }}
          value={selectedHotel}
          onChange={(e) => {
            setSelectedHotel(e.target.value);
            setSearchParams(e.target.value ? { hotelId: e.target.value } : {});
          }}
        >
          <option value="">All Properties</option>
          {hotels.map((h) => (
            <option key={h._id} value={h._id}>
              {h.name} ({h.city})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving room inventory..." />
      ) : rooms.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Hotel</th>
                <th>Price / Night</th>
                <th>Capacity</th>
                <th>Total Units</th>
                <th>Bed Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.roomType}</strong></td>
                  <td>{r.hotel?.name || 'Hotel'}</td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>${r.pricePerNight}</strong>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} color="#0284c7" /> {r.capacity} Guests
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                      {r.totalQuantity} units
                    </span>
                  </td>
                  <td>{r.bedType || 'King Bed'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(r)} className="btn btn-secondary btn-sm" title="Edit Room">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, room: r })}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        title="Delete Room"
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
          <BedDouble size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3>No Room Types Found</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
            Add room inventory units with pricing and capacity to enable bookings.
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn btn-primary"
            disabled={hotels.length === 0}
          >
            <PlusCircle size={16} /> Add First Room
          </button>
        </div>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Room Type"
      >
        <form onSubmit={handleCreateRoom}>
          <div className="form-group">
            <label className="form-label">Assign to Hotel *</label>
            <select
              className="form-control"
              value={roomForm.hotel}
              onChange={(e) => setRoomForm({ ...roomForm, hotel: e.target.value })}
              required
            >
              <option value="">Select Hotel</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room Type Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deluxe Ocean View Suite"
              value={roomForm.roomType}
              onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Price / Night ($) *</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={roomForm.pricePerNight}
                onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity (Guests) *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Inventory Units *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={roomForm.totalQuantity}
                onChange={(e) => setRoomForm({ ...roomForm, totalQuantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bed Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 1 King Bed, 2 Queen Beds"
              value={roomForm.bedType}
              onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Room Description</label>
            <textarea
              rows="3"
              className="form-control"
              value={roomForm.description}
              onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amenities (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={roomForm.amenities}
              onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Room...' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, room: null })}
        title={`Edit ${editModal.room?.roomType}`}
      >
        <form onSubmit={handleUpdateRoom}>
          <div className="form-group">
            <label className="form-label">Room Type Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.roomType}
              onChange={(e) => setEditForm({ ...editForm, roomType: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Price / Night ($)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={editForm.pricePerNight}
                onChange={(e) => setEditForm({ ...editForm, pricePerNight: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={editForm.capacity}
                onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Units</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={editForm.totalQuantity}
                onChange={(e) => setEditForm({ ...editForm, totalQuantity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bed Type</label>
            <input
              type="text"
              className="form-control"
              value={editForm.bedType}
              onChange={(e) => setEditForm({ ...editForm, bedType: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-control"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setEditModal({ open: false, room: null })}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Room Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, room: null })}
        title="Delete Room Type"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Are you sure you want to delete room type <strong>{deleteModal.room?.roomType}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setDeleteModal({ open: false, room: null })}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteRoom}
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Room'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

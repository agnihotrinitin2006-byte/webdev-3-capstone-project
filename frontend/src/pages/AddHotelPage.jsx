import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AlertMessage from '../components/common/AlertMessage';
import { hotelService } from '../services/hotelService';
import { Building, ArrowLeft } from 'lucide-react';

export default function AddHotelPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'United States',
    phone: '',
    email: '',
    rating: 4.8,
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    amenities: 'Free Wi-Fi, Air Conditioning, Swimming Pool, Fine Dining, Fitness Center, 24/7 Front Desk'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.description) {
      return setError('Please fill in hotel name, address, city, and description.');
    }

    setLoading(true);
    try {
      const imagesArr = formData.images
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img.length > 0);

      const amenitiesArr = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        rating: Number(formData.rating) || 4.5,
        images: imagesArr,
        amenities: amenitiesArr
      };

      const res = await hotelService.createHotel(payload);
      if (res.success) {
        navigate('/manager/hotels');
      }
    } catch (err) {
      setError(err.message || 'Failed to create hotel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px' }}>
        <button
          onClick={() => navigate('/manager/hotels')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '20px' }}
        >
          <ArrowLeft size={16} /> Back to Hotels
        </button>

        <div className="page-header">
          <div>
            <h1 className="page-title">Add New Hotel Property</h1>
            <p className="page-description">
              List a new hotel to start offering rooms and managing bookings.
            </p>
          </div>
        </div>

        {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Hotel Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. The Grand Azure Resort"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                placeholder="Describe the hotel amenities, atmosphere, and location highlights..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="e.g. 1240 Ocean Drive"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="e.g. Miami"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  className="form-control"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="hotel@stayeasy.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URLs (comma-separated)</label>
              <input
                type="text"
                name="images"
                className="form-control"
                placeholder="https://images.unsplash.com/..., https://..."
                value={formData.images}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Paste high-resolution image URLs separated by commas.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Amenities (comma-separated)</label>
              <input
                type="text"
                name="amenities"
                className="form-control"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => navigate('/manager/hotels')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Creating Hotel...' : 'Save & Publish Hotel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

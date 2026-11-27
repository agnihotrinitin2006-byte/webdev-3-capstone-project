import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, Bed } from 'lucide-react';

export default function HotelCard({ hotel }) {
  // Find minimum room price
  let minPrice = null;
  if (hotel.rooms && hotel.rooms.length > 0) {
    minPrice = Math.min(...hotel.rooms.map((r) => r.pricePerNight));
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const displayImage = hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImage;

  return (
    <div className="hotel-card">
      <div className="hotel-card-image-wrap">
        <img src={displayImage} alt={hotel.name} className="hotel-card-image" loading="lazy" />
        <div className="hotel-card-badge">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{hotel.rating || 4.5}</span>
        </div>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-location">
          <MapPin size={14} color="#0284c7" />
          <span>
            {hotel.city}, {hotel.country || 'USA'}
          </span>
        </div>

        <h3 className="hotel-title">{hotel.name}</h3>

        <p className="hotel-desc">{hotel.description}</p>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="hotel-amenities-tags">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="amenity-tag">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="hotel-card-footer">
          <div className="price-tag">
            {minPrice !== null ? (
              <>
                <span className="amount">${minPrice}</span>
                <span className="per-night">per night starting</span>
              </>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Check room pricing
              </span>
            )}
          </div>

          <Link to={`/hotels/${hotel._id}`} className="btn btn-primary btn-sm">
            <span>View Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

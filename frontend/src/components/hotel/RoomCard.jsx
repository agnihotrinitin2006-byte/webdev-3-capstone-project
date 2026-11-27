import React, { useState, useEffect } from 'react';
import { Bed, Users, Check, AlertCircle } from 'lucide-react';
import { roomService } from '../../services/roomService';

export default function RoomCard({ room, checkIn, checkOut, onSelectRoom, isSelected }) {
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (checkIn && checkOut && room._id) {
      setChecking(true);
      roomService
        .checkAvailability(room._id, checkIn, checkOut, 1)
        .then((res) => {
          if (res.success) {
            setAvailability(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setChecking(false));
    } else {
      setAvailability(null);
    }
  }, [room._id, checkIn, checkOut]);

  const defaultRoomImg =
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';
  const displayImage = room.images && room.images.length > 0 ? room.images[0] : defaultRoomImg;

  const isAvailable = availability ? availability.isAvailable : true;
  const availableUnits = availability ? availability.availableUnits : room.totalQuantity;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 0 0 4px rgba(2, 132, 199, 0.15)' : 'var(--shadow-sm)',
        marginBottom: '20px',
        transition: 'var(--transition)'
      }}
    >
      <div style={{ flex: '1 1 280px', minHeight: '200px', maxHeight: '250px', overflow: 'hidden' }}>
        <img
          src={displayImage}
          alt={room.roomType}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          flex: '2 1 340px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{room.roomType}</h3>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${room.pricePerNight}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                per night
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
            {room.description}
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="#0284c7" /> Max Guests: {room.capacity}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bed size={16} color="#0284c7" /> Bed: {room.bedType || 'King Bed'}
            </span>
          </div>

          {room.amenities && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
              {room.amenities.map((item, idx) => (
                <span key={idx} className="amenity-tag">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            {checking ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Checking dates...</span>
            ) : availability ? (
              isAvailable ? (
                <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={16} /> Available ({availableUnits} room{availableUnits > 1 ? 's' : ''} left)
                </span>
              ) : (
                <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={16} /> Sold out for selected dates
                </span>
              )
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {room.totalQuantity} room units inventory
              </span>
            )}
          </div>

          <button
            onClick={() => onSelectRoom(room)}
            disabled={!isAvailable}
            className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
          >
            {isSelected ? 'Selected' : 'Select Room'}
          </button>
        </div>
      </div>
    </div>
  );
}

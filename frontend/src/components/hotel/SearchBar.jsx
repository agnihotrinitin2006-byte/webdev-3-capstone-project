import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

export default function SearchBar({ initialValues, onSearch }) {
  const navigate = useNavigate();
  const { searchParams, updateSearch } = useBooking();

  const [city, setCity] = useState(initialValues?.city || searchParams.city || '');
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || searchParams.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || searchParams.checkOut || '');
  const [capacity, setCapacity] = useState(initialValues?.capacity || searchParams.capacity || 1);

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {
      city,
      checkIn,
      checkOut,
      capacity
    };
    updateSearch(query);

    if (onSearch) {
      onSearch(query);
    } else {
      const searchParamsObj = new URLSearchParams();
      if (city) searchParamsObj.append('city', city);
      if (checkIn) searchParamsObj.append('checkIn', checkIn);
      if (checkOut) searchParamsObj.append('checkOut', checkOut);
      if (capacity) searchParamsObj.append('capacity', capacity);
      navigate(`/hotels?${searchParamsObj.toString()}`);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-form-grid">
        <div className="search-field">
          <label className="search-label">
            <MapPin size={14} color="#0284c7" /> Destination / City
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. Miami, New York, San Francisco"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label className="search-label">
            <Calendar size={14} color="#0284c7" /> Check-in Date
          </label>
          <input
            type="date"
            min={todayStr}
            className="search-input"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label className="search-label">
            <Calendar size={14} color="#0284c7" /> Check-out Date
          </label>
          <input
            type="date"
            min={checkIn || todayStr}
            className="search-input"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label className="search-label">
            <Users size={14} color="#0284c7" /> Guests
          </label>
          <select
            className="search-input"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4+ Guests</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '46px', alignSelf: 'flex-end' }}>
          <Search size={18} />
          <span>Find Hotels</span>
        </button>
      </form>
    </div>
  );
}

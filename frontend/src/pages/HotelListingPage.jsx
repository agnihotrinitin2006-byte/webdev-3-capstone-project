import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/hotel/SearchBar';
import HotelCard from '../components/hotel/HotelCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { hotelService } from '../services/hotelService';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';

export default function HotelListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const capacity = searchParams.get('capacity') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local filter states
  const [filterMinPrice, setFilterMinPrice] = useState(minPrice);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPrice);

  const fetchHotels = () => {
    setLoading(true);
    hotelService
      .getHotels({
        city,
        checkIn,
        checkOut,
        capacity,
        minPrice,
        maxPrice
      })
      .then((res) => {
        if (res.success) {
          setHotels(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, [city, checkIn, checkOut, capacity, minPrice, maxPrice]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (filterMinPrice) newParams.set('minPrice', filterMinPrice);
    else newParams.delete('minPrice');

    if (filterMaxPrice) newParams.set('maxPrice', filterMaxPrice);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handleResetFilter = () => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: '30px 24px 60px' }}>
      {/* Top Search Bar */}
      <SearchBar initialValues={{ city, checkIn, checkOut, capacity }} />

      <div style={{ display: 'flex', gap: '32px', marginTop: '30px', alignItems: 'flex-start' }}>
        {/* Filters Sidebar */}
        <aside
          style={{
            width: '280px',
            flexShrink: 0,
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <SlidersHorizontal size={18} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filter Results</h3>
          </div>

          <form onSubmit={handleApplyFilter}>
            <div className="form-group">
              <label className="form-label">Price Range ($/night)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.88rem' }}
                  value={filterMinPrice}
                  onChange={(e) => setFilterMinPrice(e.target.value)}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.88rem' }}
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Apply
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Search Criteria summary */}
          {(city || checkIn || checkOut) && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Current Search
              </div>
              {city && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  City: <strong>{city}</strong>
                </div>
              )}
              {checkIn && checkOut && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Dates: <strong>{checkIn}</strong> to <strong>{checkOut}</strong>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Hotel Cards Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {city ? `Hotels in "${city}"` : 'All Available Accommodations'}
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
              {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching available hotels and checking room inventory..." />
          ) : hotels.length > 0 ? (
            <div className="hotels-grid" style={{ marginTop: 0 }}>
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Available Hotels Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Try adjusting your city search, flexible dates, or removing price filters.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setFilterMinPrice('');
                  setFilterMaxPrice('');
                }}
                className="btn btn-primary btn-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

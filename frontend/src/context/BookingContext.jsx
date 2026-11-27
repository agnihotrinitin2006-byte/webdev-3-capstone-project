import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  // Search parameters persisted across pages
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    capacity: 1,
    minPrice: '',
    maxPrice: ''
  });

  // Current booking draft for checkout
  const [bookingDraft, setBookingDraft] = useState({
    hotel: null,
    room: null,
    checkInDate: '',
    checkOutDate: '',
    nights: 1,
    roomQuantity: 1,
    totalAmount: 0
  });

  const updateSearch = (newParams) => {
    setSearchParams((prev) => ({ ...prev, ...newParams }));
  };

  const clearSearch = () => {
    setSearchParams({
      city: '',
      checkIn: '',
      checkOut: '',
      capacity: 1,
      minPrice: '',
      maxPrice: ''
    });
  };

  const setDraft = (draftData) => {
    setBookingDraft((prev) => ({ ...prev, ...draftData }));
  };

  const clearDraft = () => {
    setBookingDraft({
      hotel: null,
      room: null,
      checkInDate: '',
      checkOutDate: '',
      nights: 1,
      roomQuantity: 1,
      totalAmount: 0
    });
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearch,
        clearSearch,
        bookingDraft,
        setDraft,
        clearDraft
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

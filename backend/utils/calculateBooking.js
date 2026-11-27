/**
 * Calculate difference in days between two dates
 */
const calculateNights = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Normalize time to midnight UTC for precise day calculation
  const utcCheckIn = Date.UTC(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());
  const utcCheckOut = Date.UTC(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate());

  const diffTime = utcCheckOut - utcCheckIn;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

/**
 * Generate a unique memorable booking ID e.g. SE-849204
 */
const generateBookingId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SE-${randomNum}`;
};

module.exports = {
  calculateNights,
  generateBookingId
};

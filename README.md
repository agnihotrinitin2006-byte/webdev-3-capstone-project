# StayEasy – Hotel Room Booking System (MERN Stack)

A complete, fully functional, responsive full-stack Hotel Room Booking System built with **React.js, Node.js, Express.js, and MongoDB**.

StayEasy features role-based access control for **Guest**, **Hotel Manager**, and **Admin**, date-based availability search, guaranteed zero double-booking overlap logic, instant reservation confirmation, booking cancellation with automatic inventory restoration, and MongoDB aggregation analytics.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local community server running on port `27017` or MongoDB Atlas URI)

### 2. Install Dependencies
Run the following in the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Seed Database with Realistic Demo Data
From the `backend` folder, execute:
```bash
npm run seed
```
This populates:
- **Admin**: `admin@stayeasy.com` / `password123`
- **Hotel Manager**: `manager@stayeasy.com` / `password123`
- **Guest**: `guest@stayeasy.com` / `password123`
- 3 Luxury Hotels (Miami, New York, San Francisco)
- 5 Room classifications with capacities and pricing
- Active and past bookings for analytics and history

### 4. Run the Application
Open two terminal windows in VS Code:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Client will start on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 👥 Default Login Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Guest** | `guest@stayeasy.com` | `password123` | Search, book rooms, view booking receipts, cancel bookings |
| **Hotel Manager** | `manager@stayeasy.com` | `password123` | Add/edit/delete hotels, manage room types, view property revenue & occupancy |
| **Admin** | `admin@stayeasy.com` | `password123` | Manage users (roles & suspensions), oversee all hotels, view all bookings, system-wide analytics |

---

## 🔒 Overlap Condition & Double-Booking Prevention

Double-booking is prevented at the database query level using the strict interval condition:
```javascript
Existing booking check-in < New check-out AND Existing booking check-out > New check-in
```
Active room availability formula:
$$\text{Available Units} = \text{Room.totalQuantity} - \sum \text{Overlapping Confirmed Bookings}$$
If $\text{Available Units} < \text{Requested Quantity}$, the API rejects the request with HTTP 400.

---

## 📂 Project Structure

```
├── backend/
│   ├── config/          # MongoDB Mongoose connection
│   ├── controllers/     # Business logic & Aggregation pipelines
│   ├── middleware/      # JWT verification, Role authorization, Error handlers
│   ├── models/          # User, Hotel, Room, Booking schemas
│   ├── routes/          # RESTful route definitions
│   ├── seeds/           # Database seed script
│   ├── utils/           # JWT token generator, Booking helpers
│   ├── .env             # Backend environment variables
│   ├── server.js        # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute, SearchBar, Cards, Modals
│   │   ├── context/     # AuthContext, BookingContext
│   │   ├── hooks/       # useAuth, useFetch
│   │   ├── pages/       # All 18 application pages
│   │   ├── services/    # Fetch API service layer
│   │   ├── App.jsx      # React Router configuration
│   │   ├── index.css    # Responsive theme styling (Blue/White/Slate)
│   │   └── main.jsx     # App entry point
│   ├── .env             # Frontend environment variables
│   ├── vite.config.js   # Vite configuration with API proxy
│   └── package.json
└── package.json         # Root scripts
```

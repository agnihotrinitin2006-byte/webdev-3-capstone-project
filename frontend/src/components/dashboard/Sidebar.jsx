import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Building,
  PlusCircle,
  Users,
  BarChart3,
  Sliders,
  BedDouble,
  FileText
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-user-name">{user?.name}</div>
        <div className="sidebar-user-email">{user?.email}</div>
        <span className={`badge badge-${user?.role === 'hotel_manager' ? 'manager' : user?.role}`}>
          {user?.role === 'hotel_manager' ? 'Hotel Manager' : user?.role}
        </span>
      </div>

      <ul className="sidebar-menu">
        {/* Guest Links */}
        {user?.role === 'guest' && (
          <>
            <li>
              <NavLink
                to="/guest/dashboard"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <CalendarCheck size={18} />
                <span>My Bookings</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Hotel Manager Links */}
        {user?.role === 'hotel_manager' && (
          <>
            <li>
              <NavLink
                to="/manager/dashboard"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Manager Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager/hotels"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Building size={18} />
                <span>Manage Hotels</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager/hotels/add"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <PlusCircle size={18} />
                <span>Add New Hotel</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager/rooms"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <BedDouble size={18} />
                <span>Manage Rooms</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>Analytics & Revenue</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Admin Links */}
        {user?.role === 'admin' && (
          <>
            <li>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Admin Console</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager/hotels"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Building size={18} />
                <span>All Hotels</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager/rooms"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <BedDouble size={18} />
                <span>All Rooms</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>System Analytics</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}

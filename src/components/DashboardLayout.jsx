import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout, getCurrentUser, fetchUserProfile } from "../services/authService";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenUser = getCurrentUser();
  const [user, setUser] = useState({
    name: "",
    email: tokenUser?.email || "",
    role: tokenUser?.role || "patient"
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser({
          name: profile.name,
          email: profile.email,
          role: profile.role
        });
      } catch (err) {
        console.error("Failed to load user profile");
      }
    };

    if (tokenUser) {
      loadUserProfile();
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const patientLinks = [
    {
      to: "/patient/doctors",
      label: "Find Doctors",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    },
    {
      to: "/patient/appointments",
      label: "My Appointments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    }
  ];

  const doctorLinks = [
    {
      to: "/doctor/appointments",
      label: "Appointments",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
    {
      to: "/doctor/availability",
      label: "Manage Slots",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      to: "/doctor/profile",
      label: "My Profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ];

  const links = user.role === "doctor" ? doctorLinks : patientLinks;

  return (
    <div className="d-flex vh-100">
      {/* Mobile Header */}
      <nav className="navbar navbar-light bg-white border-bottom d-lg-none position-fixed top-0 start-0 end-0" style={{ zIndex: 1030 }}>
        <div className="container-fluid">
          <button className="btn btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24" style={{ color: '#7C3AED' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            DocAppointment
          </span>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar d-flex flex-column position-fixed top-0 start-0 h-100 p-3 ${sidebarOpen ? '' : 'd-none d-lg-flex'}`}
        style={{ 
          width: '280px', 
          zIndex: 1050,
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Brand */}
        <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 rounded-3 p-3 mb-4">
          <div className="bg-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, color: '#7C3AED' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <span className="text-white fw-semibold fs-5">DocAppointment</span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1">
          <p className="text-white text-opacity-50 text-uppercase small fw-semibold px-3 mb-2">Menu</p>
          <ul className="list-unstyled">
            {links.map((link) => (
              <li key={link.to} className="mb-1">
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
                      isActive 
                        ? 'bg-white text-primary' 
                        : 'text-white text-opacity-75'
                    }`
                  }
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="bg-white bg-opacity-10 rounded-3 p-3 mt-auto">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold" style={{ width: 40, height: 40, fontSize: '14px' }}>
              {getInitials(user.name || user.email)}
            </div>
            <div className="flex-grow-1 text-truncate">
              <p className="text-white small mb-0 fw-medium">{user.name || "Loading..."}</p>
              <p className="text-white text-opacity-60 small mb-0">{user.role === "doctor" ? "Doctor" : "Patient"}</p>
            </div>
          </div>
          <button className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 overflow-auto" style={{ marginLeft: '280px' }}>
        <div className="d-lg-none" style={{ height: '60px' }}></div>
        {children}
      </main>

      <style>{`
        @media (max-width: 992px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardLayout;
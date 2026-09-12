import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import WardenLogin from "./pages/WardenLogin";
import StudentDashboard from "./pages/StudentDashboard";
import HostelA from "./pages/HostelA";
import Floor1 from "./pages/Floor1";
import Booking from "./pages/Booking";
import WardenDashboard from "./pages/WardenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">SmartHostel</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/student-login">
          <button className="nav-login">Login</button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">

        <div className="hero-content">

          <p className="tagline">
            SMART HOSTEL MANAGEMENT
          </p>

          <h1>
            Your Hostel.
            <br />
            <span>Smarter & Simpler.</span>
          </h1>

          <p className="hero-text">
            Book your hostel room online, select your preferred
            room, upload documents and get approval from the
            warden digitally.
          </p>

          <div className="hero-buttons">

            <Link to="/student-login">
              <button className="primary-btn">
                Student Login
              </button>
            </Link>

            <Link to="/warden-login">
              <button className="secondary-btn">
                Warden Login
              </button>
            </Link>

          </div>
        </div>

        {/* Booking Card */}
        <div className="booking-card">

          <div className="card-header">
            <h3>Find Your Room</h3>
            <span>● Live</span>
          </div>

          <div className="select-box">
            <label>Hostel</label>
            <p>🏠 Select Hostel</p>
          </div>

          <div className="select-box">
            <label>Floor</label>
            <p>▦ Select Floor</p>
          </div>

          <div className="room-status">

            <div>
              <span className="dot available"></span>
              Available
            </div>

            <div>
              <span className="dot occupied"></span>
              Occupied
            </div>

            <div>
              <span className="dot pending"></span>
              Pending
            </div>

          </div>

          <Link to="/student-login">
            <button className="card-btn">
              View Rooms →
            </button>
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">
          <p>WHY SMART HOSTEL?</p>
          <h2>Everything in one place.</h2>
        </div>

        <div className="feature-container">

          <div className="feature-card">
            <div className="icon">🛏️</div>

            <h3>Easy Room Booking</h3>

            <p>
              View available rooms and select your
              preferred room and bed easily.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📄</div>

            <h3>Digital Documents</h3>

            <p>
              Upload your required documents directly
              through the application.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">✅</div>

            <h3>Warden Approval</h3>

            <p>
              Your application is verified and approved
              digitally by the warden.
            </p>
          </div>

        </div>

      </section>

      {/* About */}
      <section className="about" id="about">

        <div>
          <p className="tagline">
            ABOUT SMART HOSTEL
          </p>

          <h2>
            Hostel management,
            <br />
            <span>made simple.</span>
          </h2>
        </div>

        <p>
          SmartHostel connects students, wardens and
          administrators on a single digital platform.
          From room selection to final allotment,
          everything can be managed online.
        </p>

      </section>

      {/* Footer */}
      <footer>
        <h3>SmartHostel</h3>

        <p>
          Smart Hostel Room Booking System
        </p>

        <p>
          © 2026 SmartHostel
        </p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Student Login */}
        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        {/* Student Registration */}
        <Route
          path="/student-register"
          element={<StudentRegister />}
        />

        {/* Warden Login */}
        <Route
          path="/warden-login"
          element={<WardenLogin />}
        />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* Hostel A */}
        <Route
          path="/hostels/hostel-a"
          element={<HostelA />}
        />

        {/* Floor 1 */}
        <Route
          path="/hostels/hostel-a/floor-1"
          element={<Floor1 />}
        />

        {/* Booking */}
        <Route
          path="/booking/:room"
          element={<Booking />}
        />

        {/* Warden Dashboard */}
        <Route
          path="/warden-dashboard"
          element={<WardenDashboard />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        {/* {AdminLogin} */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
          />
        

      </Routes>

    </BrowserRouter>
  );
}

export default App;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const storedStudent = JSON.parse(
    localStorage.getItem("student")
  );

  const studentId = localStorage.getItem("studentId");

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch bookings"
        );
      }

      const myBooking = data.find(
        (item) =>
          item.studentId?._id === studentId ||
          item.studentId === studentId
      );

      setBooking(myBooking || null);
    } catch (error) {
      console.error("Booking Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setStudent(storedStudent);

    if (studentId) {
      fetchBooking();
    } else {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooking();
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");

    navigate("/");
  };

  const getStatus = () => {
    if (!booking) {
      return {
        text: "No Booking",
        icon: "🏠",
        className: "status-none",
      };
    }

    if (booking.status === "Pending") {
      return {
        text: "Pending",
        icon: "🟡",
        className: "status-pending",
      };
    }

    if (booking.status === "Confirmed") {
      return {
        text: "Confirmed",
        icon: "🟢",
        className: "status-confirmed",
      };
    }

    return {
      text: "Rejected",
      icon: "🔴",
      className: "status-rejected",
    };
  };

  const status = getStatus();

  if (loading) {
    return (
      <div className="dashboard">
        <main className="dashboard-content dashboard-loading">
          <div className="dashboard-loader"></div>

          <h2>
            Loading your dashboard...
          </h2>

          <p>
            Please wait a moment.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">

        <div className="student-logo">

          <div className="student-logo-icon">
            SH
          </div>

          <div className="student-brand-text">
            <h2>SmartHostel</h2>
            <small>Student Portal</small>
          </div>

        </div>

        <div className="student-nav-right">

          <div className="student-mini-profile">

            <div className="student-avatar">
              {student?.name
                ? student.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div className="student-mini-name">
              <span>
                {student?.name || "Student"}
              </span>

              <small>
                Student
              </small>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="dashboard-content">

        {/* ================= WELCOME ================= */}

        <section className="student-welcome">

          <div className="welcome-content">

            <p className="section-label">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {student?.name || "Student"} 👋
            </h1>

            <p className="welcome-description">
              Manage your hostel application,
              room booking and student profile
              from one place.
            </p>

          </div>

          <button
            className="refresh-dashboard-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? "⏳ Refreshing..."
              : "🔄 Refresh"}
          </button>

        </section>


        {/* ================= QUICK STATS ================= */}

        <section className="student-stats">

          <div className="student-stat-card">

            <div className="stat-icon status-stat-icon">
              {status.icon}
            </div>

            <div className="stat-content">

              <span>
                Booking Status
              </span>

              <strong>
                {status.text}
              </strong>

            </div>

          </div>


          <div className="student-stat-card">

            <div className="stat-icon">
              🛏️
            </div>

            <div className="stat-content">

              <span>
                Room
              </span>

              <strong>
                {booking
                  ? booking.roomNumber
                  : "Not Assigned"}
              </strong>

            </div>

          </div>


          <div className="student-stat-card">

            <div className="stat-icon">
              🏫
            </div>

            <div className="stat-content">

              <span>
                Hostel
              </span>

              <strong>
                {booking
                  ? booking.hostelName
                  : "Not Assigned"}
              </strong>

            </div>

          </div>

        </section>


        {/* ================= MAIN GRID ================= */}

        <section className="student-dashboard-grid">

          {/* ================= BOOKING CARD ================= */}

          <section className="student-booking-card">

            <div className="student-card-heading">

              <div>
                <p className="section-label">
                  HOSTEL APPLICATION
                </p>

                <h2>
                  Your Room Booking
                </h2>
              </div>

              {booking && (
                <span
                  className={`booking-status-badge ${status.className}`}
                >
                  {status.icon} {status.text}
                </span>
              )}

            </div>


            {booking ? (

              <div className="booking-content">

                {/* ROOM SUMMARY */}

                <div className="room-summary">

                  <div className="room-summary-icon">
                    🛏️
                  </div>

                  <div className="room-summary-info">

                    <span>
                      ALLOTTED / REQUESTED ROOM
                    </span>

                    <h2>
                      Room {booking.roomNumber}
                    </h2>

                    <p>
                      {booking.hostelName} • Floor{" "}
                      {booking.floor}
                    </p>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="booking-details-grid">

                  <div className="booking-detail-item">
                    <span>FULL NAME</span>
                    <strong>
                      {booking.studentName ||
                        student?.name ||
                        "—"}
                    </strong>
                  </div>

                  <div className="booking-detail-item">
                    <span>ENROLLMENT</span>
                    <strong>
                      {booking.enrollment || "—"}
                    </strong>
                  </div>

                  <div className="booking-detail-item">
                    <span>BRANCH</span>
                    <strong>
                      {booking.branch || "—"}
                    </strong>
                  </div>

                  <div className="booking-detail-item">
                    <span>ACADEMIC YEAR</span>
                    <strong>
                      {booking.year || "—"}
                    </strong>
                  </div>

                </div>


                {/* DOCUMENT */}

                <div className="document-status">

                  <div className="document-left">

                    <div className="document-icon">
                      📄
                    </div>

                    <div>

                      <strong>
                        Student Document
                      </strong>

                      <p>
                        {booking.document
                          ? "Document uploaded successfully"
                          : "No document uploaded"}
                      </p>

                    </div>

                  </div>

                  {booking.document && (
                    <button
                      className="document-view-btn"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${booking.document}`,
                          "_blank"
                        )
                      }
                    >
                      View ↗
                    </button>
                  )}

                </div>


                {/* PENDING */}

                {booking.status === "Pending" && (

                  <div className="booking-message pending-message">

                    <span>⏳</span>

                    <div>

                      <strong>
                        Application under review
                      </strong>

                      <p>
                        Your documents have been
                        submitted. Please wait for
                        the warden to verify your
                        application.
                      </p>

                    </div>

                  </div>

                )}


                {/* CONFIRMED */}

                {booking.status === "Confirmed" && (

                  <div className="booking-message confirmed-message">

                    <span>🎉</span>

                    <div>

                      <strong>
                        Room booking confirmed!
                      </strong>

                      <p>
                        Your hostel room has been
                        successfully approved by
                        the warden.
                      </p>

                    </div>

                  </div>

                )}


                {/* REJECTED */}

                {booking.status === "Rejected" && (

                  <div className="booking-message rejected-message">

                    <span>⚠️</span>

                    <div>

                      <strong>
                        Booking request rejected
                      </strong>

                      <p>
                        Your previous application
                        was rejected. You can
                        choose another available
                        room and apply again.
                      </p>

                    </div>

                  </div>

                )}

              </div>

            ) : (

              <div className="no-booking">

                <div className="no-booking-icon">
                  🏠
                </div>

                <h3>
                  No room booked yet
                </h3>

                <p>
                  Choose an available hostel
                  room and submit your
                  application to get started.
                </p>

                <button
                  onClick={() =>
                    navigate("/hostels/hostel-a")
                  }
                >
                  Find Available Rooms →
                </button>

              </div>

            )}

          </section>


          {/* ================= PROFILE ================= */}

          <aside className="student-profile-card">

            <div className="profile-heading">

              <div className="large-student-avatar">
                {student?.name
                  ? student.name.charAt(0).toUpperCase()
                  : "S"}
              </div>

              <div>

                <p className="section-label">
                  STUDENT PROFILE
                </p>

                <h2>
                  {student?.name || "Student"}
                </h2>

              </div>

            </div>


            <div className="profile-details">

              <div className="profile-row">
                <span>📧 Email</span>
                <strong>
                  {student?.email || "—"}
                </strong>
              </div>

              <div className="profile-row">
                <span>🎓 Enrollment</span>
                <strong>
                  {student?.rollNumber || "—"}
                </strong>
              </div>

              <div className="profile-row">
                <span>📚 Course</span>
                <strong>
                  {student?.course || "CSE"}
                </strong>
              </div>

              <div className="profile-row">
                <span>📅 Year</span>
                <strong>
                  {student?.year || "—"}
                </strong>
              </div>

              <div className="profile-row">
                <span>📱 Phone</span>
                <strong>
                  {student?.phone || "Not provided"}
                </strong>
              </div>

            </div>


            <button
              className="profile-room-btn"
              onClick={() =>
                navigate("/hostels/hostel-a")
              }
            >
              🏠 Browse Hostel Rooms
            </button>

          </aside>

        </section>


        {/* ================= BOOKING PROCESS ================= */}

        <section className="booking-process">

          <div className="process-heading">

            <p className="section-label">
              HOW IT WORKS
            </p>

            <h2>
              Hostel Booking Process
            </h2>

            <p>
              Simple, transparent and completely
              online.
            </p>

          </div>


          <div className="process-steps">

            <div className="process-step">

              <div className="process-number">
                1
              </div>

              <div>
                <h3>
                  Choose Room
                </h3>

                <p>
                  Select your preferred available room.
                </p>
              </div>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                2
              </div>

              <div>
                <h3>
                  Submit Details
                </h3>

                <p>
                  Fill your details and upload documents.
                </p>
              </div>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                3
              </div>

              <div>
                <h3>
                  Warden Verification
                </h3>

                <p>
                  Warden checks your application.
                </p>
              </div>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                4
              </div>

              <div>
                <h3>
                  Room Confirmed
                </h3>

                <p>
                  Get your final hostel allotment.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ================================
  // FETCH BOOKINGS
  // ================================

  const fetchBookings = async () => {
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

      setBookings(data);
    } catch (error) {
      console.error("Booking Fetch Error:", error);
    }
  };

  // ================================
  // FETCH ROOMS
  // ================================

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/rooms"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch rooms"
        );
      }

      setRooms(data);
    } catch (error) {
      console.error("Room Fetch Error:", error);
    }
  };

  // ================================
  // LOAD DATA
  // ================================

  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchBookings(),
      fetchRooms(),
    ]);

    setLoading(false);
  };

  // ================================
  // AUTH
  // ================================

  useEffect(() => {
    const warden = localStorage.getItem("warden");

    if (!warden) {
      navigate("/warden-login");
      return;
    }

    loadData();
  }, [navigate]);

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    localStorage.removeItem("warden");
    navigate("/warden-login");
  };

  // ================================
  // APPROVE BOOKING
  // ================================

  const handleApprove = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this booking?"
    );

    if (!confirmApprove) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Approval failed");
        return;
      }

      alert("Booking approved successfully ✅");

      setSelectedBooking(null);
      setSelectedRoom(null);

      await loadData();
    } catch (error) {
      console.error("Approve Error:", error);
      alert("Server connection failed ❌");
    }
  };

  // ================================
  // REJECT BOOKING
  // ================================

  const handleReject = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this booking?"
    );

    if (!confirmReject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Rejection failed");
        return;
      }

      alert("Booking rejected successfully ❌");

      setSelectedBooking(null);
      setSelectedRoom(null);

      await loadData();
    } catch (error) {
      console.error("Reject Error:", error);
      alert("Server connection failed ❌");
    }
  };

  // ================================
  // VIEW DOCUMENT
  // ================================

  const handleViewDocument = (documentPath) => {
    if (!documentPath) {
      alert("No document uploaded.");
      return;
    }

    const documentUrl =
      `http://localhost:5000${documentPath}`;

    window.open(documentUrl, "_blank");
  };

  // ================================
  // STATISTICS
  // ================================

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const fullRooms = rooms.filter(
    (room) => room.status === "Full"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  // ================================
  // FIND ROOM BOOKING
  // ================================

  const getRoomBooking = (room) => {
    return bookings.find(
      (booking) =>
        booking.roomNumber === room.roomNumber &&
        booking.hostelName === room.hostelName &&
        Number(booking.floor) === Number(room.floor) &&
        (
          booking.status === "Pending" ||
          booking.status === "Confirmed"
        )
    );
  };

  // ================================
  // ROOM STATUS
  // ================================

  const getRoomDisplayStatus = (room) => {
    const booking = getRoomBooking(room);

    if (booking?.status === "Pending") {
      return "Pending";
    }

    if (
      booking?.status === "Confirmed" ||
      room.status === "Full"
    ) {
      return "Occupied";
    }

    return "Available";
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="warden-page">
        <div className="warden-loading">

          <div className="warden-loader">
            ⏳
          </div>

          <h2>
            Loading Warden Dashboard...
          </h2>

          <p>
            Fetching live hostel data...
          </p>

        </div>
      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="warden-page">

      {/* ================= NAVBAR ================= */}

      <nav className="warden-navbar">

        <div className="warden-brand">

          <div className="warden-logo">
            SH
          </div>

          <div>
            <h2>
              SmartHostel
            </h2>

            <span>
              Warden Portal
            </span>
          </div>

        </div>

        <div className="warden-nav-actions">

          <button
            className="warden-refresh-btn"
            onClick={loadData}
          >
            🔄 Refresh
          </button>

          <button
            className="warden-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="warden-container">

        {/* ================= HERO ================= */}

        <section className="warden-hero">

          <div>

            <p className="warden-eyebrow">
              WARDEN DASHBOARD
            </p>

            <h1>
              Hostel Management
            </h1>

            <p>
              Manage room applications, verify
              documents and approve student bookings.
            </p>

          </div>

          <div className="warden-hostel-badge">
            🏠 Hostel A

            <span>
              Floor 1
            </span>
          </div>

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="warden-stats">

          <div className="warden-stat-card">

            <div className="warden-stat-icon">
              🏠
            </div>

            <div>
              <span>
                Total Rooms
              </span>

              <h2>
                {totalRooms}
              </h2>

              <p>
                Hostel A • Floor 1
              </p>
            </div>

          </div>


          <div className="warden-stat-card">

            <div className="warden-stat-icon">
              🟢
            </div>

            <div>
              <span>
                Available
              </span>

              <h2>
                {availableRooms}
              </h2>

              <p>
                Rooms available
              </p>
            </div>

          </div>


          <div className="warden-stat-card">

            <div className="warden-stat-icon">
              🟡
            </div>

            <div>
              <span>
                Pending
              </span>

              <h2>
                {pendingBookings}
              </h2>

              <p>
                Awaiting review
              </p>
            </div>

          </div>


          <div className="warden-stat-card">

            <div className="warden-stat-icon">
              ✅
            </div>

            <div>
              <span>
                Confirmed
              </span>

              <h2>
                {confirmedBookings}
              </h2>

              <p>
                Approved bookings
              </p>
            </div>

          </div>

        </section>


        {/* ================= ROOM OVERVIEW ================= */}

        <section className="warden-section">

          <div className="warden-section-heading">

            <div>

              <p>
                ROOM OVERVIEW
              </p>

              <h2>
                Hostel A • Floor 1
              </h2>

              <span>
                Click any room to view occupancy details.
              </span>

            </div>

          </div>


          {/* ROOM SUMMARY */}

          <div className="warden-room-overview">

            <div className="warden-room-box available">

              <span>
                🟢
              </span>

              <div>

                <small>
                  AVAILABLE
                </small>

                <strong>
                  {availableRooms}
                </strong>

              </div>

            </div>


            <div className="warden-room-box full">

              <span>
                🔴
              </span>

              <div>

                <small>
                  OCCUPIED
                </small>

                <strong>
                  {fullRooms}
                </strong>

              </div>

            </div>


            <div className="warden-room-box total">

              <span>
                🏠
              </span>

              <div>

                <small>
                  TOTAL
                </small>

                <strong>
                  {totalRooms}
                </strong>

              </div>

            </div>

          </div>


          {/* ROOM GRID */}

          <div className="warden-room-grid">

            {rooms.map((room) => {

              const roomBooking =
                getRoomBooking(room);

              const displayStatus =
                getRoomDisplayStatus(room);

              const roomClass =
                displayStatus === "Pending"
                  ? "room-pending"
                  : displayStatus === "Occupied"
                  ? "room-occupied"
                  : "room-available";

              return (

                <button
                  key={room._id}
                  className={`warden-room-card ${roomClass}`}
                  onClick={() =>
                    setSelectedRoom({
                      room,
                      booking: roomBooking || null,
                    })
                  }
                >

                  <div className="room-card-top">

                    <span className="room-number">
                      Room {room.roomNumber}
                    </span>

                    <span className="room-status-dot">

                      {displayStatus === "Pending"
                        ? "🟡"
                        : displayStatus === "Occupied"
                        ? "🔴"
                        : "🟢"}

                    </span>

                  </div>


                  <div className="room-card-status">

                    {displayStatus}

                  </div>


                  <div className="room-card-bottom">

                    {roomBooking ? (

                      <>
                        <strong>
                          {roomBooking.studentName}
                        </strong>

                        <small>
                          {roomBooking.status}
                        </small>
                      </>

                    ) : (

                      <>
                        <strong>
                          Single Occupancy
                        </strong>

                        <small>
                          Ready for booking
                        </small>
                      </>

                    )}

                  </div>

                </button>

              );

            })}

          </div>

        </section>


        {/* ================= APPLICATIONS ================= */}

        <section className="warden-section">

          <div className="warden-section-heading">

            <div>

              <p>
                BOOKING APPLICATIONS
              </p>

              <h2>
                Student Applications
              </h2>

              <span>
                Review student details and uploaded documents.
              </span>

            </div>

            <div className="application-count">
              {bookings.length} Applications
            </div>

          </div>


          {bookings.length === 0 ? (

            <div className="warden-empty">

              <div>
                📭
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Student booking requests will appear here.
              </p>

            </div>

          ) : (

            <div className="warden-applications">

              {bookings.map((booking) => {

                const student =
                  booking.studentId;

                return (

                  <div
                    className="warden-application-card"
                    key={booking._id}
                  >

                    {/* STUDENT */}

                    <div className="application-student">

                      <div className="student-avatar">

                        {booking.studentName
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}

                      </div>

                      <div>

                        <h3>
                          {booking.studentName || "Student"}
                        </h3>

                        <p>
                          {booking.enrollment}
                        </p>

                        {student?.email && (
                          <small>
                            {student.email}
                          </small>
                        )}

                      </div>

                    </div>


                    {/* ROOM */}

                    <div className="application-room">

                      <span>
                        ROOM
                      </span>

                      <strong>
                        {booking.roomNumber}
                      </strong>

                      <small>
                        {booking.hostelName} • Floor {booking.floor}
                      </small>

                    </div>


                    {/* ACADEMIC */}

                    <div className="application-academic">

                      <span>
                        ACADEMIC
                      </span>

                      <strong>
                        {booking.branch}
                      </strong>

                      <small>
                        {booking.year}
                      </small>

                    </div>


                    {/* STATUS + ACTION */}

                    <div className="application-actions">

                      <span
                        className={`application-status ${
                          booking.status === "Pending"
                            ? "pending"
                            : booking.status === "Confirmed"
                            ? "confirmed"
                            : "rejected"
                        }`}
                      >

                        {booking.status === "Pending" &&
                          "🟡 Pending"}

                        {booking.status === "Confirmed" &&
                          "🟢 Confirmed"}

                        {booking.status === "Rejected" &&
                          "🔴 Rejected"}

                      </span>


                      <button
                        className="view-details-btn"
                        onClick={() =>
                          setSelectedBooking(booking)
                        }
                      >
                        👁️ View Details
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </section>

      </main>


      {/* ================= BOOKING MODAL ================= */}

      {selectedBooking && (

        <div
          className="warden-modal-overlay"
          onClick={() =>
            setSelectedBooking(null)
          }
        >

          <div
            className="warden-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="warden-modal-header">

              <div>

                <p>
                  BOOKING APPLICATION
                </p>

                <h2>
                  Application Details
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                ✕
              </button>

            </div>


            {/* STUDENT PROFILE */}

            <div className="modal-student">

              <div className="modal-avatar">

                {selectedBooking.studentName
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}

              </div>

              <div>

                <h3>
                  {selectedBooking.studentName}
                </h3>

                <p>
                  {selectedBooking.enrollment}
                </p>

              </div>

            </div>


            {/* DETAILS */}

            <div className="modal-details">

              <div>
                <span>BRANCH</span>

                <strong>
                  {selectedBooking.branch}
                </strong>
              </div>

              <div>
                <span>YEAR</span>

                <strong>
                  {selectedBooking.year}
                </strong>
              </div>

              <div>
                <span>HOSTEL</span>

                <strong>
                  {selectedBooking.hostelName}
                </strong>
              </div>

              <div>
                <span>FLOOR</span>

                <strong>
                  {selectedBooking.floor}
                </strong>
              </div>

              <div>
                <span>ROOM</span>

                <strong>
                  {selectedBooking.roomNumber}
                </strong>
              </div>

              <div>
                <span>STATUS</span>

                <strong>
                  {selectedBooking.status}
                </strong>
              </div>

            </div>


            {/* CONTACT */}

            {(selectedBooking.studentId?.email ||
              selectedBooking.studentId?.phone) && (

              <div className="modal-contact">

                <h3>
                  Contact Information
                </h3>

                {selectedBooking.studentId?.email && (
                  <p>
                    📧 {selectedBooking.studentId.email}
                  </p>
                )}

                {selectedBooking.studentId?.phone && (
                  <p>
                    📱 {selectedBooking.studentId.phone}
                  </p>
                )}

              </div>

            )}


            {/* DOCUMENT */}

            <div className="modal-document">

              <div>

                <span className="document-icon">
                  📄
                </span>

                <div>

                  <h3>
                    Student Document
                  </h3>

                  <p>
                    Uploaded document for verification
                  </p>

                </div>

              </div>


              {selectedBooking.document ? (

                <button
                  onClick={() =>
                    handleViewDocument(
                      selectedBooking.document
                    )
                  }
                >
                  Open Document ↗
                </button>

              ) : (

                <span className="no-document">
                  No document
                </span>

              )}

            </div>


            {/* ACTIONS */}

            {selectedBooking.status === "Pending" && (

              <div className="modal-actions">

                <button
                  className="modal-reject"
                  onClick={() =>
                    handleReject(
                      selectedBooking._id
                    )
                  }
                >
                  ❌ Reject
                </button>

                <button
                  className="modal-approve"
                  onClick={() =>
                    handleApprove(
                      selectedBooking._id
                    )
                  }
                >
                  ✅ Approve Booking
                </button>

              </div>

            )}

          </div>

        </div>

      )}


      {/* ================= ROOM DETAILS MODAL ================= */}

      {selectedRoom && (

        <div
          className="warden-modal-overlay"
          onClick={() =>
            setSelectedRoom(null)
          }
        >

          <div
            className="warden-modal room-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="warden-modal-header">

              <div>

                <p>
                  ROOM DETAILS
                </p>

                <h2>
                  Room {selectedRoom.room.roomNumber}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedRoom(null)
                }
              >
                ✕
              </button>

            </div>


            {/* ROOM STATUS */}

            <div className="room-modal-status">

              <span>

                {selectedRoom.booking?.status === "Pending"
                  ? "🟡"
                  : selectedRoom.booking
                  ? "🔴"
                  : "🟢"}

              </span>

              <div>

                <strong>

                  {selectedRoom.booking?.status === "Pending"
                    ? "Booking Pending"
                    : selectedRoom.booking
                    ? "Room Occupied"
                    : "Room Available"}

                </strong>

                <small>
                  Single Occupancy
                </small>

              </div>

            </div>


            {/* BOOKING DETAILS */}

            {selectedRoom.booking ? (

              <div className="modal-details">

                <div>
                  <span>STUDENT</span>

                  <strong>
                    {selectedRoom.booking.studentName}
                  </strong>
                </div>

                <div>
                  <span>ENROLLMENT</span>

                  <strong>
                    {selectedRoom.booking.enrollment}
                  </strong>
                </div>

                <div>
                  <span>BRANCH</span>

                  <strong>
                    {selectedRoom.booking.branch}
                  </strong>
                </div>

                <div>
                  <span>YEAR</span>

                  <strong>
                    {selectedRoom.booking.year}
                  </strong>
                </div>

                <div>
                  <span>HOSTEL</span>

                  <strong>
                    {selectedRoom.booking.hostelName}
                  </strong>
                </div>

                <div>
                  <span>STATUS</span>

                  <strong>
                    {selectedRoom.booking.status}
                  </strong>
                </div>

              </div>

            ) : (

              <div className="warden-empty room-empty-state">

                <div>
                  🛏️
                </div>

                <h3>
                  Room Available
                </h3>

                <p>
                  No active booking is assigned to this room.
                </p>

              </div>

            )}


            {/* OPEN FULL BOOKING */}

            {selectedRoom.booking && (

              <button
                className="view-details-btn room-view-booking"
                onClick={() => {
                  setSelectedBooking(
                    selectedRoom.booking
                  );

                  setSelectedRoom(null);
                }}
              >
                👁️ View Full Booking Details
              </button>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default WardenDashboard;
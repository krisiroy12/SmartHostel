import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [bookingResponse, roomResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/bookings"),
          fetch("http://localhost:5000/api/rooms"),
        ]);

      const bookingData = await bookingResponse.json();
      const roomData = await roomResponse.json();

      setBookings(bookingData);
      setRooms(roomData);
    } catch (error) {
      console.error("Admin Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const admin = localStorage.getItem("admin");

    if (!admin) {
      navigate("/admin-login");
      return;
    }

    loadData();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const fullRooms = rooms.filter(
    (room) => room.status === "Full"
  ).length;

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  ).length;

  const filteredBookings = bookings
    .filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (booking.studentName || "")
          .toLowerCase()
          .includes(searchText) ||
        (booking.enrollment || "")
          .toLowerCase()
          .includes(searchText) ||
        String(booking.roomNumber || "")
          .toLowerCase()
          .includes(searchText) ||
        (booking.branch || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .reverse();

  const openDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  const documentUrl = selectedBooking?.document
    ? `http://localhost:5000${selectedBooking.document}`
    : "";

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div>⏳</div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Fetching SmartHostel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* =====================================
          ADMIN NAVBAR
      ===================================== */}

      <nav className="admin-navbar">

        <div className="admin-brand">

          <div className="admin-logo">
            SH
          </div>

          <div>
            <h2>SmartHostel</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <div className="admin-nav-actions">

          <button
            className="admin-refresh-btn"
            onClick={loadData}
          >
            🔄 Refresh
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      <main className="admin-container">

        {/* =====================================
            HERO
        ===================================== */}

        <section className="admin-hero">

          <div>

            <p className="admin-eyebrow">
              ADMIN CONTROL CENTER
            </p>

            <h1>
              SmartHostel Overview
            </h1>

            <p>
              Monitor students, rooms and hostel
              booking activity from one place.
            </p>

          </div>

          <div className="admin-live-badge">
            🟢 System Active
          </div>

        </section>


        {/* =====================================
            STATS
        ===================================== */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👨‍🎓
            </div>

            <div>
              <span>Applications</span>
              <h2>{totalBookings}</h2>
              <p>Total booking records</p>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🏠
            </div>

            <div>
              <span>Total Rooms</span>
              <h2>{totalRooms}</h2>
              <p>Hostel A • Floor 1</p>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🟡
            </div>

            <div>
              <span>Pending</span>
              <h2>{pendingBookings}</h2>
              <p>Need verification</p>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ✅
            </div>

            <div>
              <span>Confirmed</span>
              <h2>{confirmedBookings}</h2>
              <p>Approved bookings</p>
            </div>

          </div>

        </section>


        {/* =====================================
            BOOKING STATUS
        ===================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <p>BOOKING STATUS</p>

            <h2>
              Application Overview
            </h2>

          </div>


          <div className="admin-status-grid">

            <div className="admin-status-card pending">

              <span>🟡</span>

              <div>
                <small>PENDING</small>
                <strong>{pendingBookings}</strong>
              </div>

            </div>


            <div className="admin-status-card confirmed">

              <span>🟢</span>

              <div>
                <small>CONFIRMED</small>
                <strong>{confirmedBookings}</strong>
              </div>

            </div>


            <div className="admin-status-card rejected">

              <span>🔴</span>

              <div>
                <small>REJECTED</small>
                <strong>{rejectedBookings}</strong>
              </div>

            </div>


            <div className="admin-status-card available">

              <span>🏠</span>

              <div>
                <small>AVAILABLE ROOMS</small>
                <strong>{availableRooms}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            HOSTEL MANAGEMENT
        ===================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <p>HOSTEL MANAGEMENT</p>

            <h2>
              Hostel A
            </h2>

            <span>
              Floor 1 room statistics
            </span>

          </div>


          <div className="admin-hostel-card">

            <div className="admin-hostel-info">

              <div className="admin-hostel-icon">
                🏢
              </div>

              <div>
                <h3>Hostel A</h3>
                <p>Floor 1</p>
              </div>

            </div>


            <div className="admin-hostel-stats">

              <div>
                <span>Total</span>
                <strong>{totalRooms}</strong>
              </div>

              <div>
                <span>Available</span>
                <strong>{availableRooms}</strong>
              </div>

              <div>
                <span>Full</span>
                <strong>{fullRooms}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            ROOM MANAGEMENT
        ===================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <p>ROOM MANAGEMENT</p>

            <h2>
              Room Status
            </h2>

            <span>
              Monitor room capacity and occupancy
            </span>

          </div>


          <div className="admin-room-grid">

            {rooms.length === 0 ? (

              <div className="admin-empty">

                🏠

                <h3>
                  No rooms found
                </h3>

                <p>
                  No room data is available.
                </p>

              </div>

            ) : (

              rooms.map((room) => {

                const capacity =
                  room.capacity || 0;

                const occupied =
                  room.occupied || 0;

                const free =
                  Math.max(
                    capacity - occupied,
                    0
                  );

                const percentage =
                  capacity
                    ? Math.min(
                        (occupied / capacity) *
                          100,
                        100
                      )
                    : 0;

                return (

                  <div
                    className="admin-room-card"
                    key={room._id}
                  >

                    <div className="admin-room-top">

                      <div className="admin-room-number">

                        <span>
                          ROOM
                        </span>

                        <strong>
                          {room.roomNumber}
                        </strong>

                      </div>


                      <span
                        className={`admin-room-status ${
                          room.status === "Full"
                            ? "full"
                            : "available"
                        }`}
                      >
                        {room.status}
                      </span>

                    </div>


                    <div className="admin-room-info">

                      <div>
                        <span>
                          Capacity
                        </span>

                        <strong>
                          {capacity}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Occupied
                        </span>

                        <strong>
                          {occupied}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Free
                        </span>

                        <strong>
                          {free}
                        </strong>
                      </div>

                    </div>


                    <div className="admin-room-progress">

                      <div
                        className="admin-room-progress-bar"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>

                    </div>


                    <div className="admin-room-footer">

                      <span>
                        {room.hostelName ||
                          "Hostel A"}
                      </span>

                      <span>
                        Floor {room.floor}
                      </span>

                    </div>

                  </div>

                );
              })

            )}

          </div>

        </section>


        {/* =====================================
            STUDENT MANAGEMENT
        ===================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <p>
              STUDENT MANAGEMENT
            </p>

            <h2>
              Student Applications
            </h2>

            <span>
              Search and monitor hostel applications
            </span>

          </div>


          <div className="admin-controls">

            <div className="admin-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search student, enrollment, room..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="admin-filter"
            >

              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>


          {filteredBookings.length === 0 ? (

            <div className="admin-empty">

              📭

              <h3>
                No applications found
              </h3>

              <p>
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            <div className="admin-table">

              <div className="admin-table-header">

                <span>
                  Student
                </span>

                <span>
                  Room
                </span>

                <span>
                  Branch
                </span>

                <span>
                  Status
                </span>

                <span>
                  Action
                </span>

              </div>


              {filteredBookings.map(
                (booking) => (

                  <div
                    className="admin-table-row"
                    key={booking._id}
                  >

                    <div>

                      <strong>
                        {booking.studentName ||
                          "Student"}
                      </strong>

                      <small>
                        {booking.enrollment ||
                          "No enrollment"}
                      </small>

                    </div>


                    <strong>
                      {booking.roomNumber || "-"}
                    </strong>


                    <span>
                      {booking.branch || "-"}
                    </span>


                    <span
                      className={`admin-status ${
                        booking.status ===
                        "Pending"
                          ? "pending"
                          : booking.status ===
                            "Confirmed"
                          ? "confirmed"
                          : "rejected"
                      }`}
                    >
                      {booking.status}
                    </span>


                    <button
                      className="admin-view-btn"
                      onClick={() =>
                        openDetails(booking)
                      }
                    >
                      View Details
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* =====================================
          DETAILS MODAL
      ===================================== */}

      {selectedBooking && (

        <div
          className="admin-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <p>
                  APPLICATION DETAILS
                </p>

                <h2>
                  Student Application
                </h2>

              </div>


              <button
                className="admin-modal-close"
                onClick={closeDetails}
              >
                ✕
              </button>

            </div>


            {/* STUDENT INFORMATION */}

            <div className="admin-modal-section">

              <h3>
                👨‍🎓 Student Information
              </h3>


              <div className="admin-detail-grid">

                <div>
                  <span>Name</span>

                  <strong>
                    {selectedBooking.studentName ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Enrollment</span>

                  <strong>
                    {selectedBooking.enrollment ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Branch</span>

                  <strong>
                    {selectedBooking.branch ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Year</span>

                  <strong>
                    {selectedBooking.year ||
                      "-"}
                  </strong>
                </div>

              </div>

            </div>


            {/* ROOM INFORMATION */}

            <div className="admin-modal-section">

              <h3>
                🏠 Room Information
              </h3>


              <div className="admin-detail-grid">

                <div>
                  <span>Hostel</span>

                  <strong>
                    {selectedBooking.hostelName ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Floor</span>

                  <strong>
                    {selectedBooking.floor ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Room Number</span>

                  <strong>
                    {selectedBooking.roomNumber ||
                      "-"}
                  </strong>
                </div>


                <div>
                  <span>Status</span>

                  <strong
                    className={`admin-status ${
                      selectedBooking.status ===
                      "Pending"
                        ? "pending"
                        : selectedBooking.status ===
                          "Confirmed"
                        ? "confirmed"
                        : "rejected"
                    }`}
                  >
                    {selectedBooking.status}
                  </strong>

                </div>

              </div>

            </div>


            {/* DOCUMENT */}

            <div className="admin-modal-section">

              <h3>
                📄 Document
              </h3>


              {selectedBooking.document ? (

                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-document-btn"
                >
                  📄 Open Uploaded Document
                </a>

              ) : (

                <div className="admin-no-document">
                  No document uploaded
                </div>

              )}

            </div>


            <div className="admin-modal-footer">

              <button
                className="admin-modal-close-btn"
                onClick={closeDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;
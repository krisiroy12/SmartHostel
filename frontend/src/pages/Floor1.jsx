import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Floor1() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);

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
      alert("Rooms load nahi ho pa rahe ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    if (room.status === "Full") {
      alert(`Room ${room.roomNumber} is full ❌`);
      return;
    }

    setSelectedRoom(room);
  };

  const continueToBooking = () => {
    if (!selectedRoom) {
      return;
    }

    navigate(
      `/booking/room-${selectedRoom.roomNumber}`
    );
  };

  return (
    <div className="floor-page">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">
        <h2>SmartHostel</h2>

        <button
          onClick={() =>
            navigate("/student-dashboard")
          }
        >
          Dashboard
        </button>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="floor-content">

        {/* ================= HEADER ================= */}

        <div className="floor-header">

          <div>
            <p className="floor-eyebrow">
              HOSTEL A • FLOOR 1
            </p>

            <h1>
              Choose Your Room 🏠
            </h1>

            <p>
              Select an available room to continue
              your hostel application.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchRooms}
          >
            🔄 Refresh
          </button>

        </div>

        {/* ================= LEGEND ================= */}

        <div className="room-legend">

          <div>
            <span className="legend-dot available"></span>
            Available
          </div>

          <div>
            <span className="legend-dot partial"></span>
            Partially Occupied
          </div>

          <div>
            <span className="legend-dot full"></span>
            Full
          </div>

        </div>

        {/* ================= FLOOR MAP ================= */}

        <section className="floor-map">

          <div className="floor-map-header">

            <div>
              <span>
                FLOOR 1
              </span>

              <small>
                HOSTEL A
              </small>
            </div>

            <div className="entrance">
              🚪 ENTRANCE
            </div>

          </div>

          {loading ? (

            <div className="room-loading">

              <div className="loader"></div>

              <p>
                Loading rooms...
              </p>

            </div>

          ) : (

            <>

              {/* ================= CORRIDOR ================= */}

              <div className="corridor">
                <span>
                  MAIN CORRIDOR
                </span>
              </div>

              {/* ================= ROOM GRID ================= */}

              <div className="room-map-grid">

                {rooms.map((room) => {

                  const isFull =
                    room.status === "Full";

                  const isPartial =
                    room.occupied > 0 &&
                    !isFull;

                  const isSelected =
                    selectedRoom?._id === room._id;

                  return (

                    <button
                      key={room._id}
                      type="button"
                      className={`hostel-room ${
                        isFull
                          ? "room-is-full"
                          : isPartial
                          ? "room-is-partial"
                          : "room-is-available"
                      } ${
                        isSelected
                          ? "room-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleRoomClick(room)
                      }
                    >

                      <span className="room-number">
                        {room.roomNumber}
                      </span>

                      <span className="room-bed-icon">
                        🛏️
                      </span>

                      <span className="room-capacity">
                        {room.occupied}/
                        {room.capacity}
                      </span>

                      <span className="room-state">

                        {isFull
                          ? "FULL"
                          : isPartial
                          ? "PARTIAL"
                          : isSelected
                          ? "SELECTED"
                          : "AVAILABLE"}

                      </span>

                    </button>

                  );
                })}

              </div>

              {/* ================= SELECTED ROOM ================= */}

              {selectedRoom && (

                <div className="selected-room-bar">

                  <div>

                    <span>
                      SELECTED ROOM
                    </span>

                    <strong>
                      Room {selectedRoom.roomNumber}
                    </strong>

                    <small>
                      {selectedRoom.occupied}/
                      {selectedRoom.capacity}
                      {" "}occupied
                    </small>

                  </div>

                  <button
                    type="button"
                    onClick={continueToBooking}
                  >
                    Continue →
                  </button>

                </div>

              )}

              {/* ================= EXIT ================= */}

              <div className="floor-exit">
                EXIT 🚪
              </div>

            </>

          )}

        </section>

        {/* ================= INFO ================= */}

        <div className="room-info-box">

          <span className="info-icon">
            💡
          </span>

          <div>

            <strong>
              How to select a room
            </strong>

            <p>
              Click on any green or yellow room
              to select it. Then click Continue
              to proceed with your booking.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Floor1;
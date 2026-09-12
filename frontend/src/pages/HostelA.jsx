import { useNavigate } from "react-router-dom";

function HostelA() {
  const navigate = useNavigate();

  const floors = [
    {
      number: 1,
      rooms: 12,
      available: 5,
    },
    {
      number: 2,
      rooms: 12,
      available: 3,
    },
    {
      number: 3,
      rooms: 12,
      available: 7,
    },
  ];

  return (
    <div className="hostel-page">

      {/* Navbar */}
      <nav className="dashboard-nav">

        <h2>SmartHostel</h2>

        <button
          onClick={() => navigate("/student-dashboard")}
        >
          ← Dashboard
        </button>

      </nav>


      {/* Content */}
      <main className="hostel-content">

        <div className="hostel-heading">

          <p className="section-label">
            HOSTEL A
          </p>

          <h1>
            Choose Your Floor
          </h1>

          <p>
            Select a floor to view available rooms.
          </p>

        </div>


        {/* Floors */}
        <div className="floor-list">

          {floors.map((floor) => (

            <div
              className="floor-card"
              key={floor.number}
              onClick={() =>
                navigate(`/hostels/hostel-a/floor-${floor.number}`)
              }
            >

              <div className="floor-number">
                {floor.number}
              </div>

              <div className="floor-info">

                <h2>
                  Floor {floor.number}
                </h2>

                <p>
                  {floor.rooms} Rooms
                </p>

              </div>

              <div className="floor-availability">

                <strong>
                  {floor.available}
                </strong>

                <span>
                  Available
                </span>

              </div>

              <div className="arrow">
                →
              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default HostelA;
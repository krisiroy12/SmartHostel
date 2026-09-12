import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Booking() {
  const { room } = useParams();
  const navigate = useNavigate();

  const roomNumber = room?.replace("room-", "");

  const [formData, setFormData] = useState({
    fullName: "",
    enrollment: "",
    branch: "",
    year: "",
    document: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPG, JPEG or PNG files are allowed.");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Document size should be less than 5 MB.");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        document: file,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.enrollment.trim() ||
      !formData.branch ||
      !formData.year ||
      !formData.document
    ) {
      alert("Please fill all details and upload your document.");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();

      dataToSend.append(
        "studentId",
        localStorage.getItem("studentId")
      );

      dataToSend.append("roomNumber", roomNumber);
      dataToSend.append("hostelName", "Hostel A");
      dataToSend.append("floor", "1");

      dataToSend.append(
        "fullName",
        formData.fullName.trim()
      );

      dataToSend.append(
        "enrollment",
        formData.enrollment.trim()
      );

      dataToSend.append(
        "branch",
        formData.branch
      );

      dataToSend.append(
        "year",
        formData.year
      );

      dataToSend.append(
        "document",
        formData.document
      );

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          body: dataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      console.log("Booking successful:", data);

      setSubmitted(true);
    } catch (error) {
      console.error("Booking Error:", error);

      alert(
        "Server se connection nahi ho pa raha. Check karo backend running hai ya nahi."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================== */

  if (submitted) {
    return (
      <div className="booking-page">

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

        <main className="booking-success-container">

          <div className="booking-success-card">

            <div className="success-icon">
              ✓
            </div>

            <p className="booking-success-label">
              APPLICATION SUBMITTED
            </p>

            <h1>
              Booking Request Sent!
            </h1>

            <p className="success-description">
              Your room booking request has been
              successfully submitted to the warden.
              Your documents will be verified before
              the room is confirmed.
            </p>

            <div className="success-room">

              <span>
                SELECTED ROOM
              </span>

              <strong>
                Room {roomNumber}
              </strong>

              <small>
                Hostel A • Floor 1
              </small>

            </div>

            <button
              className="success-dashboard-btn"
              onClick={() =>
                navigate("/student-dashboard")
              }
            >
              Go to Dashboard →
            </button>

          </div>

        </main>
      </div>
    );
  }

  /* =========================
     BOOKING FORM
  ========================== */

  return (
    <div className="booking-page">

      <nav className="dashboard-nav">

        <h2>
          SmartHostel
        </h2>

        <button
          onClick={() =>
            navigate(
              "/hostels/hostel-a/floor-1"
            )
          }
        >
          ← Back to Rooms
        </button>

      </nav>

      <main className="booking-container">

        {/* HEADER */}

        <div className="booking-header">

          <p className="booking-eyebrow">
            HOSTEL A • FLOOR 1
          </p>

          <h1>
            Complete Your Booking
          </h1>

          <p>
            Submit your details and documents
            to request this room.
          </p>

        </div>

        {/* ROOM SUMMARY */}

        <div className="booking-room-summary">

          <div className="booking-room-icon">
            🛏️
          </div>

          <div>

            <span>
              SELECTED ROOM
            </span>

            <h2>
              Room {roomNumber}
            </h2>

            <p>
              Hostel A • Floor 1
            </p>

          </div>

          <div className="booking-status">
            AVAILABLE
          </div>

        </div>

        {/* FORM CARD */}

        <div className="smarthostel-booking-card">

          <form onSubmit={handleSubmit}>

            {/* PERSONAL DETAILS */}

            <div className="form-section">

              <div className="form-section-title">

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Personal Details
                  </h3>

                  <p>
                    Enter your basic information
                  </p>

                </div>

              </div>

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Enrollment / Roll Number
                  </label>

                  <input
                    type="text"
                    name="enrollment"
                    placeholder="e.g. 23CSE101"
                    value={formData.enrollment}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* ACADEMIC DETAILS */}

            <div className="form-section">

              <div className="form-section-title">

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Academic Details
                  </h3>

                  <p>
                    Tell us about your course
                  </p>

                </div>

              </div>

              <div className="form-grid">

                {/* BRANCH */}

                <div className="form-group">

                  <label>
                    Branch
                  </label>

                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select your branch
                    </option>

                    <option value="CSE">
                      Computer Science & Engineering
                    </option>

                    <option value="ECE">
                      Electronics & Communication
                    </option>

                    <option value="ME">
                      Mechanical Engineering
                    </option>

                    <option value="Civil">
                      Civil Engineering
                    </option>

                    <option value="EEE">
                      Electrical Engineering
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* YEAR */}

                <div className="form-group">

                  <label>
                    Year
                  </label>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select year
                    </option>

                    <option value="1st Year">
                      1st Year
                    </option>

                    <option value="2nd Year">
                      2nd Year
                    </option>

                    <option value="3rd Year">
                      3rd Year
                    </option>

                    <option value="4th Year">
                      4th Year
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* DOCUMENT */}

            <div className="form-section">

              <div className="form-section-title">

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Document Verification
                  </h3>

                  <p>
                    Upload a valid student document
                  </p>

                </div>

              </div>

              <label className="document-upload">

                <div className="upload-icon">
                  📄
                </div>

                <div>

                  <strong>
                    Choose a document
                  </strong>

                  <p>
                    PDF, JPG, JPEG or PNG • Max 5 MB
                  </p>

                </div>

                <input
                  type="file"
                  name="document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                />

              </label>

              {formData.document && (

                <div className="selected-document">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      {formData.document.name}
                    </strong>

                    <small>
                      Document selected successfully
                    </small>

                  </div>

                </div>

              )}

            </div>

            {/* SUBMIT */}

            <div className="booking-submit-section">

              <div>

                <strong>
                  Ready to submit?
                </strong>

                <p>
                  Your application will be sent
                  to the warden for verification.
                </p>

              </div>

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Booking Request →"}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Booking;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (studentId === "" || password === "") {
      alert("Please enter Student ID and Password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/students/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: studentId,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save logged-in student
      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      // Save MongoDB student ID
      localStorage.setItem(
        "studentId",
        data.student.id
      );

      alert("Login successful ✅");

      navigate("/student-dashboard");

    } catch (error) {
      console.error(error);
      alert("Server connection failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>SmartHostel</h1>

        <p>Student Login</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Student ID / Email"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* REGISTER */}
        <p style={{ marginTop: "20px" }}>
          New student?{" "}

          <span
            onClick={() =>
              navigate("/student-register")
            }
            style={{
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            Create an account
          </span>

        </p>

      </div>

    </div>
  );
}

export default StudentLogin;
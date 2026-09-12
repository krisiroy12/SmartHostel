import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WardenLogin() {
  const navigate = useNavigate();

  const [wardenId, setWardenId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (wardenId === "warden01" && password === "Warden@123") {
      localStorage.setItem(
        "warden",
        JSON.stringify({
          id: "warden01",
          name: "Hostel Warden",
        })
      );

      navigate("/warden-dashboard");
      return;
    }

    setError("Invalid Warden ID or Password");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>SmartHostel</h1>

        <p>Warden Login</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Warden ID"
            value={wardenId}
            onChange={(e) => setWardenId(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "13px",
                margin: "8px 0",
              }}
            >
              ⚠️ {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default WardenLogin;
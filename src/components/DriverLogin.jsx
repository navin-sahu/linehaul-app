import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { driverCredentials } from "../assets/dummyAuth";
import "./css/Welcome.css";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      username === driverCredentials.username &&
      password === driverCredentials.password
    ) {
      sessionStorage.setItem("user", "driver");
navigate("/driver-dashboard", { replace: true });

    } else {
      setError("Invalid driver credentials");
    }
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1>Driver Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Driver ID / Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button className="btn btn-driver" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;

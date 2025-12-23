import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCredentials } from "../assets/dummyAuth";
import "./css/Welcome.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    navigate("/admin/dashboard"); 
  } else {
    setError("Invalid admin credentials");
  }
};


  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
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

          <button className="btn btn-admin" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Welcome.css";
import { authAPI } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const DriverLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
     e.preventDefault();
    setLoading(true);
    try {
      console.log("Attempting login with", { username, password });
      const res = await authAPI.login({ username, password });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/driver-dashboard", { replace: true });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };
 const handleCancel = () => {
    navigate(-1); 
  };
  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1>Driver Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Driver ID / User Name"
            required
            autoComplete="driverUserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            autoComplete="driverPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
 <div className="btn-login-group">
 
          <button className="btn btn-driver" type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : "Login"}
          </button>
            <button
              className="btn btn-cancel"
              type="button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;

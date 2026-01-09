import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { adminCredentials } from "../assets/dummyAuth";
import { authAPI } from "@/api";
import "./css/Welcome.css";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminLogin = () => {
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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin/dashboard", { replace: true });
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
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="User Name"
            required
            autoComplete="adminUserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            autoComplete="adminPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

           <div className="btn-login-group">
            <button
              className="btn btn-admin"
              type="submit"
              disabled={loading}
            >
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

export default AdminLogin;

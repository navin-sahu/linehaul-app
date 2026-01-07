import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { adminCredentials } from "../assets/dummyAuth";
import { authAPI } from "@/api";
import "./css/Welcome.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

          <button className="btn btn-admin" type="submit" disabled={loading}>
             {loading ? 
            <AiOutlineLoading3Quarters 
              style={{ 
                animation: "spin 1s linear infinite",
                display: "inline-block",
                fontSize: "20px"
              }} 
            /> : "Login"}

          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

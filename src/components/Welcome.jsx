import "./css/Welcome.css";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <img src="/images/logo.png" alt="Linehaul Logo" className="logo" />
        <h1>Welcome to Linehaul</h1>

        <div className="btn-group">
          <button
            className="btn btn-admin"
            onClick={() => navigate("/admin-login")}
          >
            Admin Login
          </button>

          <button
            className="btn btn-driver"
            onClick={() => navigate("/driver-login")}
          >
            Driver Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

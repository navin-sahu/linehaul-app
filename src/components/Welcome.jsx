import "./css/Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <img
          src="/images/logo.png"
          alt="Linehaul Logo"
          className="logo"
        />

        <h1>Welcome to Linehaul</h1>
        <div className="btn-group">
          <button className="btn btn-admin">Admin Login</button>
          <button className="btn btn-driver">Driver Login</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

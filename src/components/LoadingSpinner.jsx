import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./css/LoadingSpinner.css";

const LoadingSpinner = ({ size = 20 }) => {
  return (
    <div className="loading-spinner-container">
    <AiOutlineLoading3Quarters
      className="loading-spinner"
      style={{ fontSize: size }}
    />
    </div>
  );
};

export default LoadingSpinner;

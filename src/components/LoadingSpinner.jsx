import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./css/LoadingSpinner.css";

const LoadingSpinner = ({ size = 20 }) => {
  return (
    <AiOutlineLoading3Quarters
      className="loading-spinner"
      style={{ fontSize: size }}
    />
  );
};

export default LoadingSpinner;

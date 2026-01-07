import DriverHeader from "../layout/DriverHeader";
import AssignedToday from "./AssignedToday";
import DriverEntriesViewer from "./DriverEntriesViewer";
import { Outlet } from "react-router-dom";
// import DriverChatWidget from "../../../chat/driver/DriverChatWidget";
import styles from "../css/DriverDashboard.module.css";

const DriverDashboard = () => {
  const driver = JSON.parse(sessionStorage.getItem("driver"));

  if (!driver) return <p>Please login again</p>;

  return (
    <>
      <DriverHeader />
      <div className={styles.driverMainContent}>
      <AssignedToday driverName={driver.name} />
      <DriverEntriesViewer driverName={driver.name} />
      </div>
      {/* <DriverChatWidget driverId={driver.name} /> */}
      <Outlet />
    </>
  );
};

export default DriverDashboard;

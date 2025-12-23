import AdminLayout from "../layout/AdminLayout";
import CityTabs from "../widgets/CityTabs";
import LoadplanTable from "../widgets/LoadplanTable";
import { cityLoadplans } from "../data/adminDummyData";
import "../css/CityDetail.css";

const CityDetail = () => {
  return (
    <AdminLayout>
      <h1>Wellington – Today</h1>

      <CityTabs />

      <LoadplanTable rows={cityLoadplans["Ex WLG"]} />
    </AdminLayout>
  );
};

export default CityDetail;

const KPIBox = ({ title, value }) => {
  return (
    <div className="kpi-box">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
};

export default KPIBox;

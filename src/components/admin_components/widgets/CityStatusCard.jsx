const CityStatusCard = ({ city }) => {
  return (
    <div className="city-card">
      <h3>{city}</h3>
      <p>Loadplans: Pending</p>
      <p>Checks: Pending</p>
      <p>Sailings: OK</p>
    </div>
  );
};

export default CityStatusCard;

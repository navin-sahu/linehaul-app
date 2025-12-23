const tabs = ["Ex WLG", "Ex Taupo", "Ex CHC", "Ex AK"];

const CityTabs = () => {
  return (
    <div className="city-tabs">
      {tabs.map((tab) => (
        <button key={tab} className="active">
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CityTabs;

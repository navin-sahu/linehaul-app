import styles from "../css/CitySummaryCard.module.css";

const CitySummaryCard = ({ data, onClick }) => {
  return (
    <div className={`${styles.citySummaryCard} card`} onClick={onClick}>
      <h3>{data.city}</h3>

      <p>Total trailers: <strong>{data.total}</strong></p>

      <ul>
        <li>✅ Completed: {data.completed}</li>
        <li>⚠️ No loadplan: {data.noLoadplan}</li>
        <li>⚠️ Not checked: {data.notChecked}</li>
        <li>🚢 At risk: {data.atRisk}</li>
      </ul>
    </div>
  );
};

export default CitySummaryCard;

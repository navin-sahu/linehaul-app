const LoadplanTable = ({ rows }) => {
  return (
    <table className="loadplan-table">
      <thead>
        <tr>
          <th>Trailer</th>
          <th>Truck</th>
          <th>Driver</th>
          <th>Route</th>
          <th>Sailing</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>{row.trailer}</td>
            <td>{row.truck}</td>
            <td>{row.driver}</td>
            <td>{row.route}</td>
            <td>{row.sailing}</td>
            <td className={`status ${row.status.replace(" ", "-").toLowerCase()}`}>
              {row.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LoadplanTable;

import { useMemo, useState } from "react";
import LinehaulPlanData from "../data/LinehaulPlanData";
import "../css/LinehaulPlan.css";

const emptyEntry = {
  trucks: "",
  regos: "",
  drivers: "",
  trailers: "",
  start: "",
  boats: "",
  load: "",
  instructions: "",
  planDate: ""
};

const LinehaulPlan = () => {
  const [appData, setAppData] = useState(LinehaulPlanData);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState(emptyEntry);

  const [filterDate, setFilterDate] = useState("");
  const [filterArea, setFilterArea] = useState("ALL");

  /* ---------------- AREAS ---------------- */

  const addArea = (name) => {
    if (!name.trim()) return alert("Enter area name");
    if (appData.areas.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      return alert("Area already exists");
    }

    setAppData({
      ...appData,
      areas: [...appData.areas, { name, entries: [] }]
    });
  };

  const deleteArea = (name) => {
    if (!window.confirm("Delete area and all entries?")) return;
    setAppData({
      ...appData,
      areas: appData.areas.filter(a => a.name !== name)
    });
    setSelectedArea(null);
  };

  /* ---------------- ENTRIES ---------------- */

  const addEntry = () => {
    if (!selectedArea) return alert("Select an area first");
    if (!form.planDate) return alert("Please select plan date");

    setAppData({
      ...appData,
      areas: appData.areas.map(a =>
        a.name === selectedArea
          ? { ...a, entries: [...a.entries, form] }
          : a
      )
    });

    setForm(emptyEntry);
  };

  const editEntry = (idx) => {
    const area = appData.areas.find(a => a.name === selectedArea);
    setForm(area.entries[idx]);
    removeEntry(idx, false);
  };

  const removeEntry = (idx, confirm = true) => {
    if (confirm && !window.confirm("Delete entry?")) return;

    setAppData({
      ...appData,
      areas: appData.areas.map(a =>
        a.name === selectedArea
          ? { ...a, entries: a.entries.filter((_, i) => i !== idx) }
          : a
      )
    });
  };

  /* ---------------- VIEWER ---------------- */

  const viewerRows = useMemo(() => {
    if (!filterDate) return [];

    const rows = [];
    appData.areas.forEach(a => {
      if (filterArea !== "ALL" && a.name !== filterArea) return;
      a.entries.forEach(e => {
        if (e.planDate === filterDate) {
          rows.push({ ...e, area: a.name });
        }
      });
    });

    return rows;
  }, [filterDate, filterArea, appData]);

  /* ---------------- UI ---------------- */

  return (
    <>
      <h1>Linehaul Plan</h1>

      <div className="grid">
        {/* LEFT */}
        <div className="card">
          <h3>Areas</h3>
          <input
            placeholder="Add new area"
            onKeyDown={(e) => e.key === "Enter" && addArea(e.target.value)}
          />

          {appData.areas.map(a => (
            <div
              key={a.name}
              className={`area-item ${selectedArea === a.name ? "active" : ""}`}
            >
              <span onClick={() => setSelectedArea(a.name)}>{a.name}</span>
              <button onClick={() => deleteArea(a.name)}>Del</button>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="card">
          <h3>Entries — {selectedArea || "No area selected"}</h3>

          <input
            type="date"
            value={form.planDate}
            onChange={e => setForm({ ...form, planDate: e.target.value })}
          />

          {["trucks","regos","drivers","trailers","start","boats","load","instructions"].map(f => (
            <input
              key={f}
              placeholder={f.toUpperCase()}
              value={form[f]}
              onChange={e => setForm({ ...form, [f]: e.target.value })}
            />
          ))}

          <button onClick={addEntry}>Add Entry</button>
        </div>
      </div>

      {/* CURRENT AREA TABLE */}
      {selectedArea && (
        <table>
          <thead>
            <tr>
              <th>Area</th><th>Date</th><th>Truck</th><th>Driver</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appData.areas
              .find(a => a.name === selectedArea)
              .entries.map((e, i) => (
                <tr key={i}>
                  <td>{selectedArea}</td>
                  <td>{e.planDate}</td>
                  <td>{e.trucks}</td>
                  <td>{e.drivers}</td>
                  <td>
                    <button onClick={() => editEntry(i)}>Edit</button>
                    <button onClick={() => removeEntry(i)}>Del</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* VIEWER */}
      <div className="card">
        <h3>Entries Viewer</h3>

        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />

        <select value={filterArea} onChange={e => setFilterArea(e.target.value)}>
          <option value="ALL">All Areas</option>
          {appData.areas.map(a => (
            <option key={a.name}>{a.name}</option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th>Area</th><th>Date</th><th>Truck</th><th>Driver</th>
            </tr>
          </thead>
          <tbody>
            {viewerRows.length === 0 ? (
              <tr><td colSpan="4">No results</td></tr>
            ) : (
              viewerRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.area}</td>
                  <td>{r.planDate}</td>
                  <td>{r.trucks}</td>
                  <td>{r.drivers}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LinehaulPlan;

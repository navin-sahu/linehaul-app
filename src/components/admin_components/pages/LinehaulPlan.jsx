import { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LinehaulPlanData from "../data/LinehaulPlanData";
import styles from "../css/LinehaulPlan.module.css";
import EntriesViewer from "./EntriesViewer";

/* ---------------- CONSTANTS ---------------- */

const emptyEntry = {
  id: null,
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

  /* ---------------- AREAS ---------------- */

  const [newArea, setNewArea] = useState("");

  const addArea = (name) => {
    if (!name.trim()) return;

    setAppData(prev => ({
      ...prev,
      areas: [...prev.areas, { name, entries: [] }]
    }));

    setNewArea("");
  };

  const deleteArea = (name) => {
    if (!window.confirm("Delete area and all entries?")) return;

    setAppData(prev => ({
      ...prev,
      areas: prev.areas.filter(a => a.name !== name)
    }));

    setSelectedArea(null);
  };

  /* ---------------- ENTRY FORM ---------------- */

  const fields = [
    { name: "trucks", label: "TRUCKS", type: "text" },
    { name: "regos", label: "REGOS", type: "text" },
    { name: "drivers", label: "DRIVERS", type: "text" },
    { name: "trailers", label: "TRAILERS", type: "text" },
    { name: "start", label: "START", type: "time" },
    { name: "boats", label: "BOATS", type: "text" },
    { name: "load", label: "LOAD", type: "text" },
    { name: "instructions", label: "INSTRUCTIONS", type: "text" }
  ];

  const addEntry = () => {
    if (!selectedArea) return alert("Select an area first");
    if (!form.planDate) return alert("Please select plan date");

    const entry = {
      ...form,
      id: form.id ?? Date.now()
    };

    setAppData(prev => ({
      ...prev,
      areas: prev.areas.map(a =>
        a.name === selectedArea
          ? { ...a, entries: [...a.entries, entry] }
          : a
      )
    }));

    setForm(emptyEntry);
  };

  /* ---------------- EDIT / DELETE ---------------- */

  const editEntry = (id) => {
    const area = appData.areas.find(a => a.name === selectedArea);
    const entry = area.entries.find(e => e.id === id);
    if (!entry) return;

    setForm(entry);
    removeEntry(id, false);
  };

  const removeEntry = (id, confirm = true) => {
    if (confirm && !window.confirm("Delete entry?")) return;

    setAppData(prev => ({
      ...prev,
      areas: prev.areas.map(a =>
        a.name === selectedArea
          ? { ...a, entries: a.entries.filter(e => e.id !== id) }
          : a
      )
    }));
  };

  /* ---------------- FILTERED DATA ---------------- */

  const selectedAreaData = selectedArea
    ? appData.areas.find(a => a.name === selectedArea)
    : null;

  const filteredEntries = selectedAreaData
    ? selectedAreaData.entries.filter(e =>
        filterDate ? e.planDate === filterDate : true
      )
    : [];

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.linhaulPlanWrapper}>
      <h1>Linehaul Plan</h1>

      <div className={styles.grid}>
        {/* LEFT */}
        <div className={`${styles.widthSmall} card`}>
          <h3>Areas</h3>

          <div className={styles.addAreaRow}>
            <input
              placeholder="Add new area"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addArea(newArea)}
            />

            <button
              className={styles.addBtn}
              onClick={() => addArea(newArea)}
              title="Add Area"
            >
              <FiPlus />
            </button>
          </div>

          <div className={styles.areasList}>
            {appData.areas.map(a => (
              <div
                key={a.name}
                className={`${styles.areaItem} ${
                  selectedArea === a.name ? styles.active : ""
                }`}
                onClick={() => setSelectedArea(a.name)}
              >
                <span>{a.name}</span>

                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteArea(a.name);
                  }}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className={`${styles.flexGrowOne} card`}>
          <h3>Entries — {selectedArea || "No area selected"}</h3>

          {/* ENTRY FORM */}
          <div className={styles.entryForm}>
            <input
              type="date"
              value={form.planDate}
              onChange={(e) =>
                setForm({ ...form, planDate: e.target.value })
              }
            />

            {fields.map(f => (
              <input
                key={f.name}
                type={f.type}
                placeholder={f.label}
                value={form[f.name]}
                onChange={(e) =>
                  setForm({ ...form, [f.name]: e.target.value })
                }
              />
            ))}
          </div>

          <button className={`mt-5 ${styles.primary}`} onClick={addEntry}>
            {form.id ? "Update Entry" : "Add Entry"}
          </button>

          {/* DATE FILTER */}
          {selectedArea && (
            <div className={styles.filterBar}>
              <label>
                Filter by date:
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </label>

            </div>
          )}

          {/* TABLE */}
          {selectedArea && (
            <div className={styles.entryTable}>
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Date</th>
                    <th>Truck</th>
                    <th>Regos</th>
                    <th>Drivers</th>
                    <th>Trailers</th>
                    <th>Time</th>
                    <th>Boats</th>
                    <th>Load</th>
                    <th>Instructions</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center" }}>
                        No entries for selected date
                      </td>
                    </tr>
                  )}

                  {filteredEntries.map(e => (
                    <tr key={e.id}>
                      <td>{selectedArea}</td>
                      <td>{e.planDate}</td>
                      <td>{e.trucks}</td>
                      <td>{e.regos}</td>
                      <td>{e.drivers}</td>
                      <td>{e.trailers}</td>
                      <td>{e.start}</td>
                      <td>{e.boats}</td>
                      <td>{e.load}</td>
                      <td>{e.instructions}</td>
                      <td className={styles.actionTd}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => editEntry(e.id)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className={`${styles.iconBtn} ${styles.danger}`}
                          onClick={() => removeEntry(e.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <EntriesViewer />
    </div>
  );
};

export default LinehaulPlan;

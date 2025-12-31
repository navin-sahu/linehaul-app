import { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LinehaulPlanData from "../data/LinehaulPlanData";
import styles from "../css/LinehaulPlan.module.css";
import EntriesViewer from "./EntriesViewer";



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




  /* ---------------- AREAS ---------------- */
  const [newArea, setNewArea] = useState("");
  const addArea = (name) => {
    if (!name.trim()) return;

    setAppData((prev) => ({
      ...prev,
      areas: [...prev.areas, { name, entries: [] }],
    }));

    setNewArea("");
  };


  const deleteArea = (name) => {
    if (!window.confirm("Delete area and all entries?")) return;
    setAppData({
      ...appData,
      areas: appData.areas.filter(a => a.name !== name)
    });
    setSelectedArea(null);
  };

  const fields = [
    { name: "trucks", label: "TRUCKS", type: "text" },
    { name: "regos", label: "REGOS", type: "text" },
    { name: "drivers", label: "DRIVERS", type: "text" },
    { name: "trailers", label: "TRAILERS", type: "text" },
    { name: "start", label: "START", type: "time" },   // ✅ time
    { name: "boats", label: "BOATS", type: "text" },
    { name: "load", label: "LOAD", type: "text" },
    { name: "instructions", label: "INSTRUCTIONS", type: "text" }
  ];

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



  /* ---------------- UI ---------------- */

  return (
    <>
      <div className={styles.linhaulPlanWrapper}>


        <h1>Linehaul Plan</h1>

        <div className={styles.grid} >
          {/* LEFT */}
          <div className={`${styles.widthSmall} card`}>
            <h3>Areas</h3>

            <div className={styles.addAreaRow}>
              <input
                placeholder="Add new area"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addArea(newArea);
                }}
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
              {appData.areas.map((a) => (
                <div
                  key={a.name}
                  className={`${styles.areaItem} ${selectedArea === a.name ? styles.active : ""
                    }`}
                  onClick={() => setSelectedArea(a.name)}
                >
                  <span>{a.name}</span>

                  <button
                    className={`${styles.iconBtn} ${styles.danger}`}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting area
                      deleteArea(a.name);
                    }}
                    title="Delete"
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
            <div className={styles.entryForm}>

              <input
                type="date"
                value={form.planDate}
                onChange={e => setForm({ ...form, planDate: e.target.value })}
              />


              {fields.map(({ name, label, type }) => (
                <input
                  key={name}
                  type={type}
                  placeholder={label}
                  value={form[name]}
                  onChange={(e) =>
                    setForm({ ...form, [name]: e.target.value })
                  }
                />
              ))}
            </div>

            <button className={`mt-5 ${styles.primary}`} onClick={addEntry}>Add Entry</button>
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
                    {appData.areas
                      .find(a => a.name === selectedArea)
                      .entries.map((e, i) => (
                        <tr key={i}>
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
                            <button className={styles.iconBtn} onClick={() => editEntry(i)} title="Edit" ><FiEdit2 /></button>
                            <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => removeEntry(i)} title="Delete" ><FiTrash2 /></button>
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
    </>
  );
};

export default LinehaulPlan;

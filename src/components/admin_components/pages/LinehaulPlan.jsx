import { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LinehaulPlanData from "../data/LinehaulPlanData";
import styles from "../css/LinehaulPlan.module.css";
import EntriesViewer from "./EntriesViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { areaAPI, entryAPI } from "@/api";

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
  planDate: "",
};

const LinehaulPlan = () => {
  const [appData, setAppData] = useState(LinehaulPlanData);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState(emptyEntry);

  const { data: areas } = useQuery({
    queryKey: ["linehaulPlan"],
    queryFn: areaAPI.getAreas,
  });

  // fetch based on selected area
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["entries", selectedArea],
    queryFn: () => entryAPI.getEntriesByArea( selectedArea._id ),
    enabled: !!selectedArea?._id,
    select: (res) => res.data,
  });


  const queryClient = useQueryClient();

  const addAreaMutation = useMutation({
    mutationFn: areaAPI.createArea,
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]); // 🔥 auto refresh
      setNewArea("");
    },
  });

  const deleteAreaMutation = useMutation({
    mutationFn: areaAPI.deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
    },
  });

  //add a single entry mutation
  const addEntryMutation = useMutation({
    mutationFn: ({ areaId, data }) => entryAPI.createEntry(areaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["entries", selectedArea]);
    },
  });

  // delete a single entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: (entryId) => entryAPI.deleteEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries(["entries", selectedArea]);
    },
  });

 

  /* ---------------- AREAS ---------------- */

  const [newArea, setNewArea] = useState("");

  const addArea = (name) => {
    if (!name.trim()) return;
    addAreaMutation.mutate({ name });
  };

  const deleteArea = (areaId) => {
    // if (!window.confirm("Delete this area?")) return;
    console.log("Deleting area with ID:", areaId);
    deleteAreaMutation.mutate(areaId);
  };

  /* ---------------- ENTRY FORM ---------------- */

  const fields = [
    { name: "trucks", label: "TRUCKS", type: "text" },
    { name: "regos", label: "REGOS", type: "text" },
    { name: "drivers", label: "DRIVERS", type: "text" },
    { name: "trailers", label: "TRAILERS", type: "text" },
    { name: "start", label: "START", type: "time" }, // ✅ time
    { name: "boats", label: "BOATS", type: "text" },
    { name: "load", label: "LOAD", type: "text" },
    { name: "instructions", label: "INSTRUCTIONS", type: "text" },
  ];

  const addEntry = () => {
    if (!selectedArea) return alert("Select an area first");
    if (!form.planDate) return alert("Please select plan date");

    addEntryMutation.mutate({ areaId: selectedArea._id, data: {
      entry:{
      truck: form.trucks,
      rego: form.regos,
      driver: form.drivers,
      trailer: form.trailers,
      start_time: form.start,
      boat: form.boats,
      load: form.load,
      instruction: form.instructions,
      plan_date: form.planDate,
    }
    } });

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
    <>
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
              {areas?.data?.map((a) => (
                <div
                  key={a._id}
                  className={`${styles.areaItem} ${
                    selectedArea === a.name ? styles.active : ""
                  }`}
                  onClick={() => setSelectedArea({name: a.name, _id: a._id})}
                >
                  <span>{a.name}</span>

                  <button
                    className={`${styles.iconBtn} ${styles.danger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteArea(a._id);
                    }}
                    title="Delete"
                    type="button"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className={`${styles.flexGrowOne} card`}>
            <h3>Entries — {selectedArea?.name || "No area selected"}</h3>
            <div className={styles.entryForm}>
              <input
                type="date"
                value={form.planDate}
                onChange={(e) => setForm({ ...form, planDate: e.target.value })}
              />

              {fields.map(({ name, label, type }) => (
                <input
                  key={name}
                  type={type}
                  placeholder={label}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              ))}
            </div>

            <button className={`mt-5 ${styles.primary}`} onClick={addEntry}>
              Add Entry
            </button>
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

                    {!isLoading && entries?.map((e, i) => (
                      <tr key={e?._id || i}>
                        <td>{selectedArea.name}</td>
                        <td>{e?.plan_date}</td>
                        <td>{e?.truck}</td>
                        <td>{e?.rego}</td>
                        <td>{e?.driver}</td>
                        <td>{e?.trailer}</td>
                        <td>{e?.start_time}</td>
                        <td>{e?.boat}</td>
                        <td>{e?.load}</td>
                        <td>{e?.instruction}</td>
                        <td className={styles.actionTd}>
                          <button className={styles.iconBtn} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.danger}`}
                            title="Delete"
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

    </>
  );
};

export default LinehaulPlan;

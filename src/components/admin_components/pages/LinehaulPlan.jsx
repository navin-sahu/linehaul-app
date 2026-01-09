import { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LinehaulPlanData from "../data/LinehaulPlanData";
import styles from "../css/LinehaulPlan.module.css";
import EntriesViewer from "./EntriesViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDateInput, formatDDMMYYYY } from "@/utils";
import { areaAPI, entryAPI, authAPI } from "@/api";

const emptyEntry = {
  id: null,
  trucks: "",
  regos: "",
  drivers: "",
  driver_id: "",
  trailers: "",
  start: "",
  boats: "",
  load: "",
  instructions: "",
  planDate: "",
};

const LinehaulPlan = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [form, setForm] = useState(emptyEntry);
  const [filterDate, setFilterDate] = useState("");

  const queryClient = useQueryClient();

  const { data: areas } = useQuery({
    queryKey: ["linehaulPlan-areas"],
    queryFn: areaAPI.getAreas,
  });

  // fetch based on selected area
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["entries", selectedArea],
    queryFn: () => entryAPI.getEntriesByArea(selectedArea._id),
    enabled: !!selectedArea?._id,
    select: (res) => res.data,
  });

  // fetch drivers for the select field
  const { data: drivers } = useQuery({
    queryKey: ["linehaulPlan-drivers"],
    queryFn: () => authAPI.getDriversByName(),
    select: (res) => res.data,
  });

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

  // update a single entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ areaId, entryId, data }) =>
      entryAPI.updateEntry(areaId, entryId, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["entries", selectedArea]);
    },
  });

  // delete a single entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: ({ areaId, entryId }) => entryAPI.deleteEntry(areaId, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries(["entries", selectedArea]);
    },
    onError: (error) => {
      console.error("Error deleting entry:", error);
    },
  });

  /* ---------------- AREAS ---------------- */

  const [newArea, setNewArea] = useState("");
  const normalize = (str) => str.trim().toLowerCase();

  const filteredAreas = areas?.data?.filter((a) =>
    a.name.toLowerCase().includes(newArea.toLowerCase())
  );

  const addArea = (name) => {
    const value = name.trim();
    if (!value) return;

    const exists = areas?.data?.some(
      (a) => normalize(a.name) === normalize(value)
    );

    if (exists) {
      alert("Area already exists");
      return;
    }

    addAreaMutation.mutate({ name: value });
  };

  const deleteArea = (areaId) => {
    // if (!window.confirm("Delete this area?")) return;
    console.log("Deleting area with ID:", areaId);
    deleteAreaMutation.mutate(areaId);
  };

  const addEntry = () => {
    console.log("Adding entry:", form);
    if (!selectedArea) return alert("Select an area first");
    if (!form.planDate) return alert("Please select plan date");

    addEntryMutation.mutate({
      areaId: selectedArea._id,
      data: {
        entry: {
          truck: form.trucks,
          rego: form.regos,
          driver_name: form.drivers,
          driver: form.driver_id,
          trailer: form.trailers,
          start_time: form.start,
          boat: form.boats,
          load: form.load,
          instructions: form.instructions,
          plan_date: form.planDate,
        },
      },
    });

    setForm(emptyEntry);
  };

  /* ---------------- EDIT / DELETE ---------------- */

  const editEntry = (id) => {
    console.log("Editing entry with id:", id);
    setSelectedEntry(id);
    const entry = areas.data
      .flatMap((a) => a.entries)
      .find((e) => e._id === id);
    if (!entry) return;
    setForm({
      id: entry._id,
      planDate: formatDateInput(entry.plan_date),
      trucks: entry.truck,
      regos: entry.rego,
      drivers: entry.driver_name,
      driver_id: entry.driver || "",
      trailers: entry.trailer,
      start: entry.start_time,
      boats: entry.boat,
      load: entry.load,
      instructions: entry.instructions,
    });
  };

  const updateEntry = () => {
    console.log("Updating entry:", form);
    if (!selectedArea) return alert("Select an area first");
    if (!form.planDate) return alert("Please select plan date");

    updateEntryMutation.mutate({
      areaId: selectedArea._id,
      entryId: selectedEntry,
      data: {
        entry: {
          truck: form.trucks,
          rego: form.regos,
          driver: form.driver_id,
          driver_name: form.drivers,
          trailer: form.trailers,
          start_time: form.start,
          boat: form.boats,
          load: form.load,
          instructions: form.instructions,
          plan_date: form.planDate,
        },
      },
    });

    setForm(emptyEntry);
    setSelectedEntry(null);
  };

  /* ---------------- FILTERED DATA ---------------- */

  const filteredEntries = entries.filter((e) =>
    filterDate
      ? formatDDMMYYYY(e.plan_date) === formatDDMMYYYY(filterDate)
      : true
  );

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
                placeholder="Add or search area"
                value={newArea}
                autoComplete="off"
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addArea(newArea);
                  }
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
              {filteredAreas?.map((a) => (
                <div
                  key={a._id}
                  className={`${styles.areaItem} ${
                    selectedArea?._id === a._id ? styles.active : ""
                  }`}
                  onClick={() => {
                    setForm(emptyEntry);
                    setSelectedEntry(null);
                    setSelectedArea({ name: a.name, _id: a._id });
                  }}
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
                autoComplete="off"
                onChange={(e) => setForm({ ...form, planDate: e.target.value })}
              />

              <input
                type="text"
                placeholder="TRUCKS"
                autoComplete="off"
                value={form.trucks}
                onChange={(e) => setForm({ ...form, trucks: e.target.value })}
              />
              <input
                type="text"
                placeholder="REGOS"
                autoComplete="off"
                value={form.regos}
                onChange={(e) => setForm({ ...form, regos: e.target.value })}
              />
              {/* <input
                type="text"
                placeholder="DRIVERS"
                value={form.drivers}
                onChange={(e) => setForm({ ...form, drivers: e.target.value })}
              /> */}
              {/* replacing with a select field */}
              {/* on selecting it should add driver_id as well as driver */}
              <select
                value={form.driver_id}
                onChange={(e) => {
                  setForm({
                    ...form,
                    drivers:
                      drivers.find((d) => d._id === e.target.value)?.name || "",
                    driver_id: e.target.value,
                  });
                }}
              >
                <option value="">Select Driver</option>
                {/** populate options from drivers data */}
                {drivers?.map((driver) => (
                  <option key={driver?._id} value={driver?._id}>
                    {driver?.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="TRAILERS"
                autoComplete="off"
                value={form.trailers}
                onChange={(e) => setForm({ ...form, trailers: e.target.value })}
              />
              <input
                type="time"
                placeholder="START"
                autoComplete="off"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
              <input
                type="text"
                placeholder="BOATS"
                autoComplete="off"
                value={form.boats}
                onChange={(e) => setForm({ ...form, boats: e.target.value })}
              />
              <input
                type="text"
                placeholder="LOAD"
                autoComplete="off"
                value={form.load}
                onChange={(e) => setForm({ ...form, load: e.target.value })}
              />
              <input
                type="text"
                placeholder="INSTRUCTIONS"
                autoComplete="off"
                value={form.instructions}
                onChange={(e) =>
                  setForm({ ...form, instructions: e.target.value })
                }
              />
            </div>

            {selectedEntry ? (
              <button
                style={{ background: "#92a5a8ff" }}
                className="mt-5"
                onClick={updateEntry}
              >
                Update Entry
              </button>
            ) : (
              <button className={`mt-5 ${styles.primary}`} onClick={addEntry}>
                Add Entry
              </button>
            )}

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
                  
                    {!isLoading && filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center" }}>
                          No entries for selected date
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      filteredEntries.map((e, i) => (
                        <tr key={e?._id || i}>
                          <td>{selectedArea.name}</td>
                          <td className={styles.dateTableCell}>{formatDDMMYYYY(e?.plan_date)}</td>
                          <td>{e?.truck}</td>
                          <td>{e?.rego}</td>
                          <td>{e?.driver_name}</td>
                          <td>{e?.trailer}</td>
                          <td>{e?.start_time}</td>
                          <td>{e?.boat}</td>
                          <td>{e?.load}</td>
                          <td>{e?.instructions}</td>
                          <td className={styles.actionTd}>
                            <button
                              className={styles.iconBtn}
                              title="Edit"
                              onClick={() => editEntry(e._id)}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.danger}`}
                              title="Delete"
                              onClick={() =>
                                deleteEntryMutation.mutate({
                                  areaId: selectedArea._id,
                                  entryId: e._id,
                                })
                              }
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

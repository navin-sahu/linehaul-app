import { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LinehaulPlanData from "../data/LinehaulPlanData";
import styles from "../css/LinehaulPlan.module.css";

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

  const [filterArea, setFilterArea] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [filterTruck, setFilterTruck] = useState("");
  const [filterRegos, setFilterRegos] = useState("");
  const [filterDrivers, setFilterDrivers] = useState("");
  const [filterTrailers, setFilterTrailers] = useState("");
  useEffect(() => {
    setFilterTruck("");
    setFilterRegos("");
    setFilterDrivers("");
    setFilterTrailers("");
  }, [filterArea]);


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

  /* ---------------- VIEWER ---------------- */

  const viewerRows = useMemo(() => {
    let rows = [];

    appData.areas.forEach(area => {
      area.entries.forEach(e => {
        rows.push({ ...e, area: area.name });
      });
    });

    return rows.filter(r =>
      (filterArea === "ALL" || r.area === filterArea) &&
      (!filterDate || r.planDate === filterDate) &&
      (r.trucks || "").toLowerCase().includes(filterTruck.toLowerCase()) &&
      (r.regos || "").toLowerCase().includes(filterRegos.toLowerCase()) &&
      (r.drivers || "").toLowerCase().includes(filterDrivers.toLowerCase()) &&
      (r.trailers || "").toLowerCase().includes(filterTrailers.toLowerCase())
    );

  }, [
    appData,
    filterArea,
    filterDate,
    filterTruck,
    filterRegos,
    filterDrivers,
    filterTrailers
  ]);

  const COLORS = {
    primary: [30, 90, 160],
    lightBar: [235, 245, 255],
    border: [210, 220, 230],
    textDark: [40, 40, 40]
  };


  const downloadSingleRowPDF = (row) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    /* ================= HEADER ================= */

    doc.setFontSize(16);
    doc.setTextColor(...COLORS.primary);
    doc.text("Linehaul Logistics", 40, y);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Date: ${row.planDate || "-"}`, pageWidth - 200, y);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth - 200,
      y + 14
    );

    y += 30;

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Linehaul Plan", 40, y);

    y += 25;

    /* ================= AREA BAR ================= */

    doc.setFillColor(...COLORS.lightBar);
    doc.rect(40, y, pageWidth - 80, 22, "F");

    doc.setFontSize(11);
    doc.setTextColor(...COLORS.primary);
    doc.text(`Area: ${row.area || "UNKNOWN"} — 1 entry`, 50, y + 15);

    y += 30;

    /* ================= TABLE ================= */

    autoTable(doc, {
      startY: y,
      theme: "grid",
      margin: { left: 40, right: 40 },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        lineColor: COLORS.border,
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [245, 247, 250],
        textColor: 0,
        fontStyle: "bold"
      },
      bodyStyles: {
        textColor: 0
      },
      head: [[
        "Date",
        "Truck",
        "Rego",
        "Driver",
        "Trailer",
        "Start",
        "Instructions / Notes",
        "Boats",
        "Load"
      ]],
      body: [[
        row.planDate || "",
        row.trucks || "",
        row.regos || "",
        row.drivers || "",
        row.trailers || "",
        row.start || "",
        row.instructions || "",
        row.boats || "",
        row.load || ""
      ]],
      pageBreak: "auto"
    });

    doc.save(
      `loadplan-${row.area || "area"}-${row.planDate || "nodate"}.pdf`
    );
  };


  const downloadGroupedPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    /* ================= HEADER ================= */

    doc.setFontSize(16);
    doc.setTextColor(...COLORS.primary);
    doc.text("Linehaul Logistics", 40, y);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Date: ${filterDate || "All"}`, pageWidth - 200, y);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth - 200,
      y + 14
    );

    y += 30;

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Linehaul Plan", 40, y);

    y += 25;

    /* =============== GROUP DATA ================= */

    const grouped = viewerRows.reduce((acc, row) => {
      const area = row.area || "UNKNOWN";
      const reason = row.instructions || "General";

      acc[area] = acc[area] || {};
      acc[area][reason] = acc[area][reason] || [];
      acc[area][reason].push(row);

      return acc;
    }, {});

    /* =============== RENDER ================= */

    Object.entries(grouped).forEach(([area, reasons]) => {
      // Area bar
      doc.setFillColor(...COLORS.lightBar);
      doc.rect(40, y, pageWidth - 80, 22, "F");

      doc.setFontSize(11);
      doc.setTextColor(...COLORS.primary);
      doc.text(
        `Area: ${area} — ${Object.values(reasons).flat().length} entr${Object.values(reasons).flat().length > 1 ? "ies" : "y"}`,
        50,
        y + 15
      );

      y += 30;

      Object.entries(reasons).forEach(([reason, rows]) => {
        doc.setFontSize(10);
        doc.setTextColor(0);



        autoTable(doc, {
          startY: y,
          theme: "grid",
          margin: { left: 40, right: 40 },
          styles: {
            fontSize: 9,
            cellPadding: 5,
            lineColor: COLORS.border,
            lineWidth: 0.5
          },
          headStyles: {
            fillColor: [245, 247, 250],
            textColor: 0,
            fontStyle: "bold"
          },
          bodyStyles: {
            textColor: 0
          },
          head: [[
            "Date",
            "Truck",
            "Rego",
            "Driver",
            "Trailer",
            "Start",
            "Instructions / Notes",
            "Boats",
            "Load"
          ]],
          body: rows.map(r => [
            r.planDate || "",
            r.trucks || "",
            r.regos || "",
            r.drivers || "",
            r.trailers || "",
            r.start || "",
            r.instructions || "",
            r.boats || "",
            r.load || ""
          ]),
          pageBreak: "auto"
        });

        y = doc.lastAutoTable.finalY + 18;
      });

      y += 10;
    });

    doc.save("daily-linehaul-plan.pdf");
  };



  /* ---------------- UI ---------------- */

  return (
    <>
    <div className={styles.linhaulPlanWrapper}>

    
      <h1>Linehaul Plan</h1>

      <div className={styles.grid} >
        {/* LEFT */}
        <div className={styles.card}>
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


        {/* RIGHT */}
        <div className={styles.card}>
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


      {/* VIEWER */}
      <div className={styles.card}>
        <h3>Entries Viewer</h3>

        <div className={`${styles.entryTable} ${styles.viewerTable}`}>
          <table>
            <thead>
              <tr>
                <th>
                  Area
                  <select
                    value={filterArea}
                    onChange={e => setFilterArea(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    {appData.areas.map(a => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </th>

                <th>
                  Date
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                  />
                </th>

                <th>
                  Truck
                  <input
                    value={filterTruck}
                    onChange={e => setFilterTruck(e.target.value)}
                    placeholder="Search"
                  />
                </th>

                <th>
                  Regos
                  <input
                    value={filterRegos}
                    onChange={e => setFilterRegos(e.target.value)}
                    placeholder="Search"
                  />
                </th>

                <th>
                  Drivers
                  <input
                    value={filterDrivers}
                    onChange={e => setFilterDrivers(e.target.value)}
                    placeholder="Search"
                  />
                </th>

                <th>
                  Trailers
                  <input
                    value={filterTrailers}
                    onChange={e => setFilterTrailers(e.target.value)}
                    placeholder="Search"
                  />
                </th>

                <th>Time</th>
                <th>Boats</th>
                <th>Load</th>
                <th>Instructions</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {viewerRows.length === 0 ? (
                <tr><td colSpan="10">No results</td></tr>
              ) : (
                viewerRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.area}</td>
                    <td>{r.planDate}</td>
                    <td>{r.trucks}</td>
                    <td>{r.regos}</td>
                    <td>{r.drivers}</td>
                    <td>{r.trailers}</td>
                    <td>{r.start}</td>
                    <td>{r.boats}</td>
                    <td>{r.load}</td>
                    <td>{r.instructions}</td>
                    <td>
                      <button
                        className={styles.pdfBtn}
                        onClick={() => downloadSingleRowPDF(r)}
                      >
                        PDF
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button
            className={styles.exportBtn}
            onClick={downloadGroupedPDF}
          >
            Download PDF
          </button>

        </div>
      </div>
      </div>
    </>
  );
};

export default LinehaulPlan;

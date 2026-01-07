import { useMemo, useReducer } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "../css/EntriesViewer.module.css";
import LinehaulPlanData from "../data/LinehaulPlanData";
import { areaAPI } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { formatDateForInput } from "@/utils";

const EntriesViewer = () => {

  const { data: areas } = useQuery({
    queryKey: ["linehaulPlan-areas"],
    queryFn: areaAPI.getAreas,
    initialData: []
  });


  const initialFilters = {
    area: "ALL",
    date: "",
    truck: "",
    regos: "",
    drivers: "",
    trailers: "",
  };

  function filterReducer(state, action) {
    switch (action.type) {
      case "SET_AREA":
        return {
          ...state,
          area: action.payload,
          truck: "",
          regos: "",
          drivers: "",
          trailers: "",
        };

      case "SET_DATE":
        return { ...state, date: action.payload };

      case "SET_TRUCK":
        return { ...state, truck: action.payload };

      case "SET_REGOS":
        return { ...state, regos: action.payload };

      case "SET_DRIVERS":
        return { ...state, drivers: action.payload };

      case "SET_TRAILERS":
        return { ...state, trailers: action.payload };

      case "RESET_ALL":
        return initialFilters;

      default:
        return state;
    }
  }

  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const viewerRows = useMemo(() => {
    let rows = [];

    areas?.data?.forEach((area) => {
      area.entries.forEach((entry) => {
        rows.push({
          area: area.name,
          planDate: entry.plan_date ? formatDateForInput(entry.plan_date) : "",
          trucks: entry.truck,
          regos: entry.rego,
          drivers: entry.driver_name,
          trailers: entry.trailer,
          start: entry.start_time,
          instructions: entry.instructions,
          boats: entry.boat,
          load: entry.load,
        });
      });
    });

    return rows.filter(
      (r) =>
        (filters.area === "ALL" || r.area === filters.area) &&
        (!filters.date || r.planDate === formatDateForInput(filters.date)) &&
        (r.trucks || "").toLowerCase().includes(filters.truck.toLowerCase()) &&
        (r.regos || "").toLowerCase().includes(filters.regos.toLowerCase()) &&
        (r.drivers || "")
          .toLowerCase()
          .includes(filters.drivers.toLowerCase()) &&
        (r.trailers || "")
          .toLowerCase()
          .includes(filters.trailers.toLowerCase())
    );
  }, [ areas, filters ]);

  const COLORS = {
    primary: [30, 90, 160],
    lightBar: [235, 245, 255],
    border: [210, 220, 230],
    textDark: [40, 40, 40],
  };

  const downloadSingleRowPDF = (row) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
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
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [245, 247, 250],
        textColor: 0,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 0,
      },
      head: [
        [
          "Date",
          "Truck",
          "Rego",
          "Driver",
          "Trailer",
          "Start",
          "Instructions / Notes",
          "Boats",
          "Load",
        ],
      ],
      body: [
        [
          row.planDate || "",
          row.trucks || "",
          row.regos || "",
          row.drivers || "",
          row.trailers || "",
          row.start || "",
          row.instructions || "",
          row.boats || "",
          row.load || "",
        ],
      ],
      pageBreak: "auto",
    });

    doc.save(`loadplan-${row.area || "area"}-${row.planDate || "nodate"}.pdf`);
  };

  const downloadGroupedPDF = () => {
    if (viewerRows.length === 0) {
      alert("No data to export");
      return;
    }
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    /* ================= HEADER ================= */

    doc.setFontSize(16);
    doc.setTextColor(...COLORS.primary);
    doc.text("Linehaul Logistics", 40, y);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Date: ${filters.date || "All"}`, pageWidth - 200, y);

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
        `Area: ${area} — ${Object.values(reasons).flat().length} entr${
          Object.values(reasons).flat().length > 1 ? "ies" : "y"
        }`,
        50,
        y + 15
      );

      y += 30;

      Object.entries(reasons).forEach(([, rows]) => {
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
            lineWidth: 0.5,
          },
          headStyles: {
            fillColor: [245, 247, 250],
            textColor: 0,
            fontStyle: "bold",
          },
          bodyStyles: {
            textColor: 0,
          },
          head: [
            [
              "Date",
              "Truck",
              "Rego",
              "Driver",
              "Trailer",
              "Start",
              "Instructions / Notes",
              "Boats",
              "Load",
            ],
          ],
          body: rows.map((r) => [
            r.planDate || "",
            r.trucks || "",
            r.regos || "",
            r.drivers || "",
            r.trailers || "",
            r.start || "",
            r.instructions || "",
            r.boats || "",
            r.load || "",
          ]),
          pageBreak: "auto",
        });

        y = doc.lastAutoTable.finalY + 18;
      });

      y += 10;
    });

    doc.save("daily-linehaul-plan.pdf");
  };
  return (
    <>
      {/* VIEWER */}
      <div className={styles.viewerWrapper}>
        <div className="card">
          <h3>Entries Viewer</h3>

          <div className={`${styles.entryTable} ${styles.viewerTable}`}>
            <table>
              <thead>
                <tr>
                  <th>
                    Area
                    <select
                      value={filters.area}
                      onChange={(e) =>
                        dispatch({ type: "SET_AREA", payload: e.target.value })
                      }
                    >
                      <option value="ALL">All</option>
                      {areas.data?.map((a) => (
                        <option key={a.name} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </th>

                  <th>
                    Date
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) =>
                        dispatch({ type: "SET_DATE", payload: e.target.value })
                      }
                    />
                  </th>

                  <th>
                    Truck
                    <input
                      value={filters.truck}
                      onChange={(e) =>
                        dispatch({ type: "SET_TRUCK", payload: e.target.value })
                      }
                      placeholder="Search"
                    />
                  </th>

                  <th>
                    Regos
                    <input
                      value={filters.regos}
                      onChange={(e) =>
                        dispatch({ type: "SET_REGOS", payload: e.target.value })
                      }
                      placeholder="Search"
                    />
                  </th>

                  <th>
                    Drivers
                    <input
                      value={filters.drivers}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_DRIVERS",
                          payload: e.target.value,
                        })
                      }
                      placeholder="Search"
                    />
                  </th>

                  <th>
                    Trailers
                    <input
                      value={filters.trailers}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_TRAILERS",
                          payload: e.target.value,
                        })
                      }
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
                  <tr>
                    <td colSpan="11">No results</td>
                  </tr>
                ) : (
                  viewerRows.map((r, i) => (
                    <tr key={`${r.area}-${r.planDate}-${i}`}>
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
            <button className={styles.exportBtn} onClick={downloadGroupedPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntriesViewer;

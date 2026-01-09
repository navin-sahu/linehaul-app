import { useMemo, useReducer, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DriverLinehaulData from "../data/DriverLinehaulData";
import StatusBadge from "../widgets/StatusBadge";
import RowActions from "./RowActions";
import styles from "../css/EntriesViewer.module.css";
import { useQuery } from "@tanstack/react-query";
import { driverApi } from "@/api";
import { formatDDMMYYYY } from "@/utils";

const initialFilters = {
  date: "",
  area: "",
  truck: "",
  rego: "",
  trailer: "",
  boat: "",
  load: "",
};

function reducer(state, action) {
  return { ...state, [action.type]: action.value };
}


const DriverEntriesViewer = ({ driverName }) => {
  const driver = JSON.parse(localStorage.getItem("user"));
  const [filters, setFilters] = useState(initialFilters);

  const driverJobs = useMemo(() => {
    const driverBlock = DriverLinehaulData.find((d) => d.driver === driverName);

    return driverBlock ? driverBlock.jobs : [];
  }, [driverName]);

  /* ================= FILTERED ROWS ================= */
  const [jobOverrides, setJobOverrides] = useState({});

  const { data: driverEntries, isLoading, error } = useQuery({
    queryKey: ['driverJobs', driverName],
    queryFn: () => driverApi.getEntriesByDriveId(driver.id),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading jobs.</p>;
  }

  const driverJobsData = driverEntries?.data || [];

  const filteredDriverJobsData = driverJobsData
      .filter(
        (j) =>
          (!filters.date || formatDDMMYYYY(j.plan_date) === formatDDMMYYYY(filters.date)) &&
          (j.area || "").toLowerCase().includes(filters.area.toLowerCase()) &&
          (j.truck || "")
            .toLowerCase()
            .includes(filters.truck.toLowerCase()) &&
          (j.rego || "").toLowerCase().includes(filters.rego.toLowerCase()) &&
          (j.trailer || "")
            .toLowerCase()
            .includes(filters.trailer.toLowerCase()) &&
          (j.boat || "").toLowerCase().includes(filters.boat.toLowerCase()) &&
          (j.load || "").toLowerCase().includes(filters.load.toLowerCase())
          
      );

      console.log(filteredDriverJobsData,filters);


  /* ================= STATUS UPDATE ================= */
  const updateRowStatus = (jobId, status) => {
    setJobOverrides((prev) => {
      const current = prev[jobId]?.status || "NOT_STARTED";

      // 🔒 Lock COMPLETED
      if (current === "COMPLETED") return prev;

      return {
        ...prev,
        [jobId]: {
          status,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  /* ================= PDF ================= */
const COLORS = {
  primary: [57, 29, 56],      // brand color
  textDark: [33, 33, 33],
  lightBar: [245, 247, 250],
  border: [220, 220, 220],
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
        row.name || row.drivers || "",
        row.trailers || "",
        row.start || "",
        row.instructions || "",
        row.boats || "",
        row.load || "",
      ],
    ],
    pageBreak: "auto",
  });

  doc.save(
    `loadplan-${row.area || "area"}-${row.planDate || "nodate"}.pdf`
  );
};



  /* ================= UI ================= */
  return (
    <div className={`card mt-5`}>
      <h3>My Linehaul Jobs</h3>
      <div className={styles.viewerWrapper}>
        <div className={`${styles.entryTable} ${styles.viewerTable}`}>
          <table>
            <thead>
              <tr>
                <th>
                  Date
                  <input
                    type="date"
                    autoComplete="off"
                    value={filters.date}
                    onChange={(e) =>
                      setFilters({ ...filters, date: e.target.value })
                    }
                  />
                </th>
                <th>
                  Area
                  <input
                    value={filters.area}
                    placeholder="Area"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, area: e.target.value })
                    }
                  />
                </th>
                <th>
                  Truck
                  <input
                    value={filters.truck}
                    placeholder="Truck"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, truck: e.target.value })
                    }
                  />
                </th>

                <th>
                  Rego
                  <input
                    value={filters.regos}
                    placeholder="Rego"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, rego: e.target.value })
                    }
                  />
                </th>

                <th>Driver</th>

                <th>
                  Trailer
                  <input
                    value={filters.trailer}
                    placeholder="Trailer"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, trailer: e.target.value })
                    }
                  />
                </th>

                <th>Start</th>

                <th>
                  Boats
                  <input
                    value={filters.boat}
                    placeholder="Boat"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, boat: e.target.value })
                    }
                  />
                </th>

                <th>
                  Load
                  <input
                    value={filters.load}
                    placeholder="Load"
                    autoComplete="off"
                    onChange={(e) =>
                      setFilters({ ...filters, load: e.target.value })
                    }
                  />
                </th>

                <th>Instructions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDriverJobsData.length === 0 ? (
                <tr>
                  <td colSpan="12">No jobs assigned</td>
                </tr>
              ) : (
                filteredDriverJobsData?.map((r,i) => (
                  <tr key={i}>
                    <td>{formatDDMMYYYY(r?.plan_date)}</td>
                    <td>{r?.area}</td>
                    <td>{r?.truck}</td>
                    <td>{r?.rego}</td>
                    <td>{r?.driver_name}</td>
                    <td>{r?.trailer}</td>
                    <td>{r?.start_time}</td>
                    <td>{r?.boat}</td>
                    <td>{r?.load}</td>
                    <td>{r?.instructions}</td>
                    <td
                      title={
                        r?.statusUpdatedAt
                          ? new Date(r.statusUpdatedAt).toLocaleString()
                          : ""
                      }
                    >
                      <StatusBadge
                        status={r?.status || "NOT_STARTED"}
                        onChange={(newStatus) =>
                          updateRowStatus(r.jobId, newStatus)
                        }
                      />
                    </td>
                    <td className={`${styles.actionsCellWrapper} ${styles.verticalAlignMiddle}`}>
                    <div className={styles.actionsCellSpacer} >
                      <button
                        className={styles.pdfBtn}
                        onClick={() => downloadSingleRowPDF(r)}
                      >
                        PDF
                      </button>

                      <RowActions row={r} onStatusChange={updateRowStatus} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverEntriesViewer;

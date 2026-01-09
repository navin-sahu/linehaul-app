import LinehaulPlanData from "../../admin_components/data/LinehaulPlanData";
import styles from "../css/AssignedToday.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery } from "@tanstack/react-query";
import { driverApi } from "@/api";
import { formatDDMMYYYY } from "@/utils";

/* ===== PDF COLORS (same as admin) ===== */
const COLORS = {
  primary: [57, 29, 56],
  textDark: [33, 33, 33],
  lightBar: [245, 247, 250],
  border: [220, 224, 230],
};

const AssignedToday = ({ driverName }) => {
  const driver = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().slice(0, 10);

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
  /* ===== MERGE AREA INTO ROW ===== */
  const jobs = driverJobsData.filter(
    (e) =>
    formatDDMMYYYY(e.plan_date) === formatDDMMYYYY(today) &&
    e.status !== "completed"
  )


  /* ===== SINGLE JOB PDF ===== */
  const downloadSingleRowPDF = (row) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    doc.setFontSize(16);
    doc.setTextColor(...COLORS.primary);
    doc.text("Linehaul Logistics", 40, y);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Date: ${formatDDMMYYYY(row.plan_date) || "-"}`, pageWidth - 200, y);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth - 200,
      y + 14
    );

    y += 30;

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Driver Job Sheet", 40, y);

    y += 25;

    doc.setFillColor(...COLORS.lightBar);
    doc.rect(40, y, pageWidth - 80, 22, "F");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.primary);
    doc.text(`Area: ${row.area}`, 50, y + 15);

    y += 30;

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
      head: [
        [
          "Date",
          "Truck",
          "Rego",
          "Driver",
          "Trailer",
          "Start",
          "Instructions",
          "Boats",
          "Load",
        ],
      ],
      body: [
        [
          formatDDMMYYYY(row.plan_date),
          row.truck,
          row.rego,
          row.driver_name,
          row.trailer,
          row.start,
          row.instructions,
          row.boats,
          row.load,
        ],
      ],
    });

    doc.save(`job-${row.truck}-${row.plan_date}.pdf`);
  };

  return (
    <div className={`${styles.wrapper} card mt-5`}>
      <h3 className={styles.heading}>Today's Jobs</h3>

      {jobs.length === 0 ? (
        <div className={styles.empty}>No pending jobs</div>
      ) : (
        <div className={styles.grid}>
          {jobs.map((j, i) => (
            <div key={i} className={styles.jobCard}>
              <div className={styles.topRow}>
                <span className={styles.area}>{j.area}</span>
                <button
                  className={styles.pdfBtn}
                  onClick={() => downloadSingleRowPDF(j)}
                >
                  Export PDF
                </button>
              </div>

              <div className={styles.metaGrid}>
                <div>
                  <span>Truck</span>
                  {j.truck}
                </div>
                <div>
                  <span>Start</span>
                  {j.start_time || "-"}
                </div>

                <div>
                  <span>Load</span>
                  {j.load}
                </div>
                <div>
                  <span>Boats</span>
                  {j.boat || "-"}
                </div>

                <div>
                  <span>Date</span>
                  {formatDDMMYYYY(j.plan_date)}
                </div>
                <div>
                  <span>Rego</span>
                  {j.rego}
                </div>

                <div>
                  <span>Trailer</span>
                  {j.trailer || "-"}
                </div>
              </div>

              <div className={styles.notes}>
                <span>Instructions</span>
                {j.instructions || "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedToday;

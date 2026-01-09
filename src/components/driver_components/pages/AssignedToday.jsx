import LinehaulPlanData from "../../admin_components/data/LinehaulPlanData";
import styles from "../css/AssignedToday.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { driverApi } from "@/api";

/* ===== PDF COLORS (same as admin) ===== */
const COLORS = {
  primary: [57, 29, 56],
  textDark: [33, 33, 33],
  lightBar: [245, 247, 250],
  border: [220, 224, 230],
};

const AssignedToday = ({ driverName }) => {
  
  const today = new Date().toISOString().slice(0, 10);

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['linehaulPlan'],
  //   queryFn: driverApi.getEntriesByDriveId(driverId),
  // });
  /* ===== MERGE AREA INTO ROW ===== */
  const jobs = LinehaulPlanData.areas.flatMap((area) =>
    area.entries
      .filter(
        (e) =>
          e.drivers === driverName &&
          e.planDate === today &&
          e.status !== "COMPLETED"
      )
      .map((e) => ({ ...e, area: area.name }))
  );

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
    doc.text(`Date: ${row.planDate || "-"}`, pageWidth - 200, y);
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
          row.planDate,
          row.trucks,
          row.regos,
          row.drivers,
          row.trailers,
          row.start,
          row.instructions,
          row.boats,
          row.load,
        ],
      ],
    });

    doc.save(`job-${row.trucks}-${row.planDate}.pdf`);
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
                  {j.trucks}
                </div>
                <div>
                  <span>Start</span>
                  {j.start || "-"}
                </div>

                <div>
                  <span>Load</span>
                  {j.load}
                </div>
                <div>
                  <span>Boats</span>
                  {j.boats || "-"}
                </div>

                <div>
                  <span>Date</span>
                  {j.planDate}
                </div>
                <div>
                  <span>Rego</span>
                  {j.regos}
                </div>

                <div>
                  <span>Trailer</span>
                  {j.trailers || "-"}
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

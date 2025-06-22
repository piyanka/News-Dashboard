// utils/exportUtils.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { Article } from "@/types"; // ✅ Import shared type

export function exportToCSV(data: Article[]) {
  const header = ["Title", "Author", "Published At", "Type"];
  const rows = data.map(article => [
    article.title,
    article.author,
    article.publishedAt,
    article.type,
  ]);

  const csvContent = [header, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "payout_report.csv");
}

export function exportToPDF(data: Article[]) {
  const doc = new jsPDF();
  const tableColumn = ["Title", "Author", "Published At", "Type"];
  const tableRows = data.map(article => [
    article.title,
    article.author,
    new Date(article.publishedAt).toLocaleString(),
    article.type,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10 },
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save("payout_report.pdf");
}

export function exportToGoogleSheets(data: Article[]) {
  alert(
    "Google Sheets integration is not available in this local project. You would normally authenticate with Google APIs and push data to a sheet here."
  );
}

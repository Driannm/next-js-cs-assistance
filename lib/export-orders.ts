import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Format Tanggal Indonesia
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const exportOrdersToExcel = (
  orders: any[],
  date: Date,
  session: string
) => {
  // 1. Ratakan data untuk Excel
  const dataToExport = orders.map((o, index) => ({
    No: index + 1,
    Nama: o.customerName,
    Alamat: o.address,
    Menu: o.menuName || "(Belum Pilih)",
    Note: o.note || "-",
    Alergi: o.allergies || "-",
    Preferensi: o.preferences || "-",
    Status:
      o.status === "sent"
        ? "Terkirim"
        : o.status === "cooking"
        ? "Dimasak"
        : "Pending",
  }));

  // 2. Buat Worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // 3. Atur lebar kolom (Opsional, biar rapi)
  const wscols = [
    { wch: 5 }, // No
    { wch: 25 }, // Nama
    { wch: 40 }, // Alamat
    { wch: 30 }, // Menu
    { wch: 20 }, // Note
    { wch: 15 }, // Alergi
    { wch: 15 }, // Preferensi
    { wch: 10 }, // Status
  ];
  worksheet["!cols"] = wscols;

  // 4. Buat Workbook & Download
  const workbook = XLSX.utils.book_new();
  const sheetName = `${session} - ${date.getDate()}`;
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const fileName = `Rekap_Order_${session}_${
    date.toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportOrdersToPDF = (
  orders: any[],
  date: Date,
  session: string
) => {
  const doc = new jsPDF();

  // Header Dokumen
  doc.setFontSize(16);
  doc.text(
    `Rekap Pesanan - ${session === "LUNCH" ? "Makan Siang" : "Makan Malam"}`,
    14,
    15
  );
  doc.setFontSize(10);
  doc.text(formatDate(date), 14, 22);

  // Filter data untuk tabel
  // Kita gabungkan Note + Alergi + Preferensi ke satu kolom biar hemat tempat di kertas
  const tableRows = orders.map((o, index) => {
    let noteCombined = "";
    if (o.menuName) noteCombined += `${o.menuName}`;
    if (o.note) noteCombined += `\n[Note: ${o.note}]`;
    if (o.allergies) noteCombined += `\n[Alert: ${o.allergies}]`;

    return [
      index + 1,
      o.customerName,
      o.address,
      noteCombined, // Menu & Notes digabung
      o.status.toUpperCase(),
    ];
  });

  const tableColumn = ["No", "Nama", "Alamat", "Menu & Detail", "Status"];

  // Generate Tabel
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [236, 72, 153] }, // Warna Pink (sesuai tema kamu)
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 },
      3: { cellWidth: "auto" }, // Menu & Note flexible
      4: { cellWidth: 20 },
    },
  });

  doc.save(`Rekap_${session}_${date.toISOString().split("T")[0]}.pdf`);
};
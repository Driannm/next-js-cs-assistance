import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (customers: any[]) => {
  const dataToExport = customers.map((c) => ({
    Nama: c.name,
    Paket: c.packageType,
    Status: c.status,
    Progress: `${c.usedDays}/${c.totalDays} Hari`,
    NoHP: c.phone,
    Alamat: c.address,
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pelanggan");
  XLSX.writeFile(workbook, "Data_Pelanggan.xlsx");
};

export const exportToPDF = (customers: any[]) => {
  const doc = new jsPDF();
  doc.text("Laporan Data Pelanggan", 14, 15);
  const tableColumn = ["Nama", "Paket", "Status", "Progress", "No HP"];
  const tableRows = customers.map((c) => [
    c.name,
    c.packageType,
    c.status,
    `${c.usedDays}/${c.totalDays}`,
    c.phone,
  ]);
  
  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
  doc.save("Data_Pelanggan.pdf");
};
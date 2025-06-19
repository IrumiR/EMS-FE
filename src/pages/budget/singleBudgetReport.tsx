import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Budget } from "@/components/types";

export const SingleBudgetReport = (budget: Budget) => {
  const doc = new jsPDF();

  // Set up the document
  doc.setFontSize(20);
  doc.text("Budget Report", 14, 20);

  // Add budget header information
  doc.setFontSize(12);
  doc.text(`Event: ${budget.eventId.eventName}`, 14, 35);
  doc.text(`Client: ${budget.clientId.userName}`, 14, 45);
  doc.text(`Created By: ${budget.createdBy.userName}`, 14, 55);

  // Add status
  const status =
    budget.isApproved === null || budget.isApproved === undefined
      ? "Pending"
      : budget.isApproved
      ? "Approved"
      : "Rejected";
  doc.text(`Status: ${status}`, 14, 65);

  // Add line separator
  doc.line(14, 72, 196, 72);

  // Prepare expenses data for table
  const expensesData = budget.expenses.map((expense, index) => [
    index + 1,
    expense.expenseName,
    `Rs. ${expense.amount.toLocaleString()}`,
  ]);

  // Add expenses table
  autoTable(doc, {
    startY: 80,
    head: [["#", "Expense Name", "Amount"]],
    body: expensesData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 120 },
      2: { cellWidth: 40, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 80;

  // Add summary section
  doc.line(14, finalY + 10, 196, finalY + 10);

  doc.setFontSize(12);
  doc.text(
    `Subtotal: Rs. ${budget.totalAmount.toLocaleString()}`,
    140,
    finalY + 25
  );
  doc.text(
    `Discount: Rs. ${budget.discount.toLocaleString()}`,
    140,
    finalY + 35
  );

  // Calculate final total
  const finalTotal = budget.totalAmount - budget.discount;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Amount: Rs. ${finalTotal.toLocaleString()}`,
    140,
    finalY + 50
  );

  // Add remarks if available
  if (budget.remarks && budget.remarks.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Remarks:", 14, finalY + 70);

    // Handle long remarks by splitting into multiple lines
    const remarks = budget.remarks;
    const maxWidth = 170;
    const lines = doc.splitTextToSize(remarks, maxWidth);
    doc.text(lines, 14, finalY + 80);
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    14,
    pageHeight - 20
  );
  doc.text(`Budget ID: ${budget._id}`, 14, pageHeight - 10);

  // Save the PDF
  const fileName = `budget-${budget.eventId.eventName.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

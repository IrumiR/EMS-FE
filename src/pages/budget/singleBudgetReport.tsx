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

  doc.line(14, 72, 196, 72);

  let currentY = 80;

  // Add expenses section if there are expenses
  if (budget.expenses && budget.expenses.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Expenses", 14, currentY);
    currentY += 10;

    const expensesData = budget.expenses.map((expense, index) => [
      index + 1,
      expense.expenseName,
      `Rs. ${expense.amount.toLocaleString()}`,
    ]);

    // Add expenses table
    autoTable(doc, {
      startY: currentY,
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

    // Update current Y position
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Add inventory items section if there are inventory items
  if (budget.inventoryItems && budget.inventoryItems.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Inventory Items", 14, currentY);
    currentY += 10;

    // Prepare inventory data for table
    const inventoryData = budget.inventoryItems.map((item, index) => [
      index + 1,
      item.itemName,
      item.remainingQuantity.toString(),
      `Rs. ${item.price.toLocaleString()}`,
      `Rs. ${(item.remainingQuantity * item.price).toLocaleString()}`,
    ]);

    // Add inventory table
    autoTable(doc, {
      startY: currentY,
      head: [["#", "Item Name", "Quantity", "Unit Price", "Total"]],
      body: inventoryData,
      theme: "grid",
      headStyles: {
        fillColor: [46, 204, 113],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 80 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 35, halign: "right" },
        4: { cellWidth: 40, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  doc.line(14, currentY, 196, currentY);
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Calculate totals
  const expensesTotal = budget.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const inventoryTotal = budget.inventoryItems.reduce(
    (sum, item) => sum + item.remainingQuantity * item.price,
    0,
  );
  const subtotal = expensesTotal + inventoryTotal;

  // Display breakdown
  if (budget.expenses.length > 0) {
    doc.text(
      `Expenses Total: Rs. ${expensesTotal.toLocaleString()}`,
      140,
      currentY,
    );
    currentY += 10;
  }

  if (budget.inventoryItems.length > 0) {
    doc.text(
      `Inventory Total: Rs. ${inventoryTotal.toLocaleString()}`,
      140,
      currentY,
    );
    currentY += 10;
  }

  doc.text(`Subtotal: Rs. ${subtotal.toLocaleString()}`, 140, currentY);
  currentY += 10;

  const discountPercent = budget.discount || 0;
  const discountAmount = Math.max(
    0,
    Math.round((subtotal * discountPercent) / 100),
  );
  const finalTotal =
    typeof budget.finalAmount === "number"
      ? budget.finalAmount
      : Math.max(0, subtotal - discountAmount);

  doc.text(`Discount: ${discountPercent.toLocaleString()}%`, 140, currentY);
  currentY += 10;
  doc.text(
    `Discount Amount: Rs. ${discountAmount.toLocaleString()}`,
    140,
    currentY,
  );
  currentY += 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Final Amount: Rs. ${finalTotal.toLocaleString()}`, 140, currentY);
  currentY += 20;

  // Add remarks and footer metadata
  if (budget.remarks && budget.remarks.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Remarks:", 14, currentY);
    currentY += 10;

    const remarks = budget.remarks;
    const maxWidth = 170;
    const lines = doc.splitTextToSize(remarks, maxWidth);
    doc.text(lines, 14, currentY);
    currentY += lines.length * 7 + 10;
  }

  const pageHeight = doc.internal.pageSize.height as number;
  let footerY = currentY + 10;

  if (footerY > pageHeight - 30) {
    doc.addPage();
    footerY = 25;
  }

  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    14,
    footerY,
  );
  doc.text(`Budget ID: ${budget._id}`, 14, footerY + 8);

  // Save the PDF
  const generatedDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const fileName = `budget-${budget.eventId.eventName.replace(
    /[^a-zA-Z0-9]/g,
    "-",
  )}-${generatedDate}.pdf`;
  doc.save(fileName);
};

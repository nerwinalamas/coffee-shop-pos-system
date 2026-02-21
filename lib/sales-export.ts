import { format } from "date-fns";
import { SalesReport } from "@/hooks/useSalesReport";

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCSV(report: SalesReport): void {
  const { rows, summary, dateRange } = report;

  const headers = [
    "Transaction #",
    "Date",
    "Customer",
    "Items",
    "Subtotal",
    "Tax",
    "Total",
    "Payment Method",
    "Status",
  ];

  const escape = (val: string | number | null | undefined): string => {
    const str = String(val ?? "");
    // Wrap in quotes if contains comma, quote, or newline
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const dataRows = rows.map((row) => [
    escape(row.transaction_number),
    escape(
      new Date(row.created_at).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    ),
    escape(row.customer_name ?? "Walk-in"),
    escape(
      row.items.length === 0
        ? "—"
        : row.items.map((i) => `${i.product_name} x${i.quantity}`).join("; "),
    ),
    escape(row.subtotal.toFixed(2)),
    escape(row.tax_amount.toFixed(2)),
    escape(row.total_amount.toFixed(2)),
    escape(row.payment_method),
    escape(row.status),
  ]);

  // Summary rows appended at the bottom
  const summaryRows = [
    [],
    ["Summary"],
    ["Total Revenue", summary.totalRevenue.toFixed(2)],
    ["Total Orders", String(summary.totalOrders)],
    ["Avg Order Value", summary.avgOrderValue.toFixed(2)],
    ["Total Tax", summary.totalTax.toFixed(2)],
    ["Completed Orders", String(summary.completedOrders)],
    ["Pending Orders", String(summary.pendingOrders)],
    ["Cancelled Orders", String(summary.cancelledOrders)],
    [],
    ["Payment Method Breakdown"],
    ...Object.entries(summary.byPaymentMethod).map(([method, amount]) => [
      method,
      amount.toFixed(2),
    ]),
  ];

  const csvContent = [
    headers.join(","),
    ...dataRows.map((r) => r.join(",")),
    ...summaryRows.map((r) => r.join(",")),
  ].join("\n");

  const fromStr = format(dateRange.from, "yyyy-MM-dd");
  const toStr = format(dateRange.to, "yyyy-MM-dd");
  const filename = `sales-report_${fromStr}_${toStr}.csv`;

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

export function exportToPDF(report: SalesReport): void {
  const { rows, summary, dateRange } = report;

  const fromStr = format(dateRange.from, "MMM d, yyyy");
  const toStr = format(dateRange.to, "MMM d, yyyy");
  const generatedAt = format(new Date(), "MMM d, yyyy h:mm a");

  const tableRows = rows
    .map(
      (row) => `
      <tr>
        <td>${row.transaction_number}</td>
        <td>${new Date(row.created_at).toLocaleString("en-PH", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}</td>
        <td>${row.customer_name ?? "Walk-in"}</td>
        <td>${
          row.items.length === 0
            ? "—"
            : row.items
                .map((i) => `${i.product_name} ×${i.quantity}`)
                .join(", ")
        }</td>
        <td>$${row.subtotal.toFixed(2)}</td>
        <td>$${row.tax_amount.toFixed(2)}</td>
        <td><strong>$${row.total_amount.toFixed(2)}</strong></td>
        <td>${row.payment_method}</td>
        <td>${row.status}</td>
      </tr>`,
    )
    .join("");

  const paymentBreakdown = Object.entries(summary.byPaymentMethod)
    .map(
      ([method, amount]) =>
        `<span class="badge">${method}: <strong>$${amount.toFixed(2)}</strong></span>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sales Report – ${fromStr} to ${toStr}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #111; padding: 32px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
    .meta { font-size: 11px; color: #666; margin-bottom: 24px; }
    .stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .stat { background: #f4f4f5; border-radius: 8px; padding: 12px 16px; min-width: 120px; }
    .stat.highlight { background: #111; color: #fff; }
    .stat label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; display: block; margin-bottom: 4px; }
    .stat.highlight label { color: #aaa; }
    .stat value { font-size: 18px; font-weight: 700; }
    .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .badge { background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 4px 10px; font-size: 11px; color: #555; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #f4f4f5; text-align: left; padding: 7px 8px; font-weight: 600; border-bottom: 1px solid #e4e4e7; }
    td { padding: 6px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .footer { margin-top: 24px; font-size: 10px; color: #999; text-align: right; }
    @media print {
      body { padding: 16px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Sales Report</h1>
  <p class="meta">${fromStr} – ${toStr} &nbsp;·&nbsp; Generated ${generatedAt}</p>

  <div class="stats">
    <div class="stat highlight">
      <label>Total Revenue</label>
      <value>$${summary.totalRevenue.toFixed(2)}</value>
    </div>
    <div class="stat">
      <label>Total Orders</label>
      <value>${summary.totalOrders}</value>
    </div>
    <div class="stat">
      <label>Avg Order Value</label>
      <value>$${summary.avgOrderValue.toFixed(2)}</value>
    </div>
    <div class="stat">
      <label>Total Tax</label>
      <value>$${summary.totalTax.toFixed(2)}</value>
    </div>
  </div>

  <div class="badges">
    ${paymentBreakdown}
    <span class="badge">Completed: <strong style="color:#15803d">${summary.completedOrders}</strong></span>
    <span class="badge">Pending: <strong style="color:#b45309">${summary.pendingOrders}</strong></span>
    <span class="badge">Cancelled: <strong style="color:#b91c1c">${summary.cancelledOrders}</strong></span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Transaction #</th>
        <th>Date</th>
        <th>Customer</th>
        <th>Items</th>
        <th>Subtotal</th>
        <th>Tax</th>
        <th>Total</th>
        <th>Payment</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <p class="footer">Sales Report · ${rows.length} transaction(s) · ${fromStr} – ${toStr}</p>

  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  // const fromFileStr = format(dateRange.from, "yyyy-MM-dd");
  // const toFileStr = format(dateRange.to, "yyyy-MM-dd");

  // Open in a new tab and trigger print dialog (acts as PDF export)
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onafterprint = () => URL.revokeObjectURL(url);
  }
}

// ─── Shared helper ────────────────────────────────────────────────────────────

function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

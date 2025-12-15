/**
 * Report Generation Utilities
 * Functions to generate reports in different formats (PDF, XLSX, CSV)
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportData = any;

/**
 * Generate PDF report
 */
export function generatePDFReport(reportData: ReportData, reportName: string, reportType: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(reportName, 14, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  const yPosition = 40;

  // Generate content based on report type
  switch (reportType) {
    case 'financial':
      generateFinancialPDF(doc, reportData, yPosition);
      break;
    case 'user_activity':
      generateUserActivityPDF(doc, reportData, yPosition);
      break;
    case 'property_performance':
      generatePropertyPerformancePDF(doc, reportData, yPosition);
      break;
    case 'booking_summary':
      generateBookingSummaryPDF(doc, reportData, yPosition);
      break;
    case 'platform_analytics':
      generatePlatformAnalyticsPDF(doc, reportData, yPosition);
      break;
    default:
      doc.text('Report data not available', 14, yPosition);
  }

  // Save the PDF
  doc.save(`${reportName}.pdf`);
}

function generateFinancialPDF(doc: jsPDF, data: ReportData, startY: number) {
  // Summary section
  doc.setFontSize(14);
  doc.text('Financial Summary', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total Revenue: TZS ${data.totalRevenue?.toLocaleString() || 0}`, 14, startY + 10);
  doc.text(`Total Commission: TZS ${data.totalCommission?.toLocaleString() || 0}`, 14, startY + 20);
  doc.text(`Completed Bookings: ${data.completedBookings || 0}`, 14, startY + 30);

  // Bookings table
  if (data.bookings && data.bookings.length > 0) {
    autoTable(doc, {
      startY: startY + 40,
      head: [['Date', 'Amount', 'Commission', 'Status']],
      body: data.bookings.slice(0, 20).map((booking: ReportData) => [
        new Date(booking.created_at).toLocaleDateString(),
        `TZS ${booking.total_amount?.toLocaleString() || 0}`,
        `TZS ${booking.service_fee?.toLocaleString() || 0}`,
        booking.status,
      ]),
    });
  }
}

function generateUserActivityPDF(doc: jsPDF, data: ReportData, startY: number) {
  doc.setFontSize(14);
  doc.text('User Activity Summary', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total New Users: ${data.totalUsers || 0}`, 14, startY + 10);
  doc.text(`New Hosts: ${data.newHosts || 0}`, 14, startY + 20);
  doc.text(`New Guests: ${data.newGuests || 0}`, 14, startY + 30);

  if (data.users && data.users.length > 0) {
    autoTable(doc, {
      startY: startY + 40,
      head: [['Date', 'User Type', 'Status']],
      body: data.users.slice(0, 20).map((user: ReportData) => [
        new Date(user.created_at).toLocaleDateString(),
        user.is_host ? 'Host' : 'Guest',
        'Active',
      ]),
    });
  }
}

function generatePropertyPerformancePDF(doc: jsPDF, data: ReportData, startY: number) {
  doc.setFontSize(14);
  doc.text('Property Performance Summary', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total Properties: ${data.totalProperties || 0}`, 14, startY + 10);
  doc.text(`Approved Properties: ${data.approvedProperties || 0}`, 14, startY + 20);
  doc.text(`Total Bookings: ${data.totalBookings || 0}`, 14, startY + 30);

  if (data.properties && data.properties.length > 0) {
    autoTable(doc, {
      startY: startY + 40,
      head: [['Property', 'Type', 'Status', 'Created']],
      body: data.properties.slice(0, 20).map((property: ReportData) => [
        property.title || 'N/A',
        property.property_type || 'N/A',
        property.status || 'N/A',
        new Date(property.created_at).toLocaleDateString(),
      ]),
    });
  }
}

function generateBookingSummaryPDF(doc: jsPDF, data: ReportData, startY: number) {
  doc.setFontSize(14);
  doc.text('Booking Summary', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total Bookings: ${data.totalBookings || 0}`, 14, startY + 10);
  doc.text(`Confirmed: ${data.confirmedBookings || 0}`, 14, startY + 20);
  doc.text(`Completed: ${data.completedBookings || 0}`, 14, startY + 30);
  doc.text(`Cancelled: ${data.cancelledBookings || 0}`, 14, startY + 40);

  if (data.bookings && data.bookings.length > 0) {
    autoTable(doc, {
      startY: startY + 50,
      head: [['Date', 'Status', 'Amount', 'Duration']],
      body: data.bookings.slice(0, 20).map((booking: ReportData) => [
        new Date(booking.created_at).toLocaleDateString(),
        booking.status || 'N/A',
        `TZS ${booking.total_amount?.toLocaleString() || 0}`,
        `${booking.total_months || 0} months`,
      ]),
    });
  }
}

function generatePlatformAnalyticsPDF(doc: jsPDF, data: ReportData, startY: number) {
  doc.setFontSize(14);
  doc.text('Platform Analytics', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total Users: ${data.totalUsers || 0}`, 14, startY + 10);
  doc.text(`Total Properties: ${data.totalProperties || 0}`, 14, startY + 20);
  doc.text(`Total Bookings: ${data.totalBookings || 0}`, 14, startY + 30);
  doc.text(`Total Revenue: TZS ${data.totalRevenue?.toLocaleString() || 0}`, 14, startY + 40);
}

/**
 * Generate Excel (XLSX) report
 */
export function generateExcelReport(reportData: ReportData, reportName: string, reportType: string) {
  const workbook = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = createSummaryData(reportData, reportType);
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Create detailed data sheet based on report type
  if (reportType === 'financial' && reportData.bookings) {
    const bookingsData = [
      ['Date', 'Amount', 'Commission', 'Status'],
      ...reportData.bookings.map((b: ReportData) => [
        new Date(b.created_at).toLocaleDateString(),
        b.total_amount || 0,
        b.service_fee || 0,
        b.status,
      ]),
    ];
    const bookingsSheet = XLSX.utils.aoa_to_sheet(bookingsData);
    XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Bookings');
  }

  if (reportType === 'user_activity' && reportData.users) {
    const usersData = [
      ['Date', 'User Type', 'Status'],
      ...reportData.users.map((u: ReportData) => [
        new Date(u.created_at).toLocaleDateString(),
        u.is_host ? 'Host' : 'Guest',
        'Active',
      ]),
    ];
    const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');
  }

  if (reportType === 'property_performance' && reportData.properties) {
    const propertiesData = [
      ['Property', 'Type', 'Status', 'Created'],
      ...reportData.properties.map((p: ReportData) => [
        p.title || 'N/A',
        p.property_type || 'N/A',
        p.status || 'N/A',
        new Date(p.created_at).toLocaleDateString(),
      ]),
    ];
    const propertiesSheet = XLSX.utils.aoa_to_sheet(propertiesData);
    XLSX.utils.book_append_sheet(workbook, propertiesSheet, 'Properties');
  }

  if (reportType === 'booking_summary' && reportData.bookings) {
    const bookingsData = [
      ['Date', 'Status', 'Amount', 'Duration'],
      ...reportData.bookings.map((b: ReportData) => [
        new Date(b.created_at).toLocaleDateString(),
        b.status || 'N/A',
        b.total_amount || 0,
        `${b.total_months || 0} months`,
      ]),
    ];
    const bookingsSheet = XLSX.utils.aoa_to_sheet(bookingsData);
    XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Bookings');
  }

  // Write the file
  XLSX.writeFile(workbook, `${reportName}.xlsx`);
}

function createSummaryData(reportData: ReportData, reportType: string): ReportData[][] {
  const summary: ReportData[][] = [
    ['Report Summary'],
    ['Generated', new Date().toLocaleString()],
    [''],
  ];

  switch (reportType) {
    case 'financial':
      summary.push(
        ['Total Revenue', `TZS ${reportData.totalRevenue?.toLocaleString() || 0}`],
        ['Total Commission', `TZS ${reportData.totalCommission?.toLocaleString() || 0}`],
        ['Completed Bookings', reportData.completedBookings || 0]
      );
      break;
    case 'user_activity':
      summary.push(
        ['Total New Users', reportData.totalUsers || 0],
        ['New Hosts', reportData.newHosts || 0],
        ['New Guests', reportData.newGuests || 0]
      );
      break;
    case 'property_performance':
      summary.push(
        ['Total Properties', reportData.totalProperties || 0],
        ['Approved Properties', reportData.approvedProperties || 0],
        ['Total Bookings', reportData.totalBookings || 0]
      );
      break;
    case 'booking_summary':
      summary.push(
        ['Total Bookings', reportData.totalBookings || 0],
        ['Confirmed', reportData.confirmedBookings || 0],
        ['Completed', reportData.completedBookings || 0],
        ['Cancelled', reportData.cancelledBookings || 0]
      );
      break;
    case 'platform_analytics':
      summary.push(
        ['Total Users', reportData.totalUsers || 0],
        ['Total Properties', reportData.totalProperties || 0],
        ['Total Bookings', reportData.totalBookings || 0],
        ['Total Revenue', `TZS ${reportData.totalRevenue?.toLocaleString() || 0}`]
      );
      break;
  }

  return summary;
}

/**
 * Generate CSV report
 */
export function generateCSVReport(reportData: ReportData, reportName: string, reportType: string) {
  let csvContent = '';

  // Add header
  csvContent += `${reportName}\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

  // Add summary
  const summaryData = createSummaryData(reportData, reportType);
  summaryData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  csvContent += '\n';

  // Add detailed data based on report type
  if (reportType === 'financial' && reportData.bookings) {
    csvContent += 'Date,Amount,Commission,Status\n';
    reportData.bookings.forEach((b: ReportData) => {
      csvContent += `${new Date(b.created_at).toLocaleDateString()},${b.total_amount || 0},${b.service_fee || 0},${b.status}\n`;
    });
  }

  if (reportType === 'user_activity' && reportData.users) {
    csvContent += 'Date,User Type,Status\n';
    reportData.users.forEach((u: ReportData) => {
      csvContent += `${new Date(u.created_at).toLocaleDateString()},${u.is_host ? 'Host' : 'Guest'},Active\n`;
    });
  }

  if (reportType === 'property_performance' && reportData.properties) {
    csvContent += 'Property,Type,Status,Created\n';
    reportData.properties.forEach((p: ReportData) => {
      csvContent += `"${p.title || 'N/A'}",${p.property_type || 'N/A'},${p.status || 'N/A'},${new Date(p.created_at).toLocaleDateString()}\n`;
    });
  }

  if (reportType === 'booking_summary' && reportData.bookings) {
    csvContent += 'Date,Status,Amount,Duration\n';
    reportData.bookings.forEach((b: ReportData) => {
      csvContent += `${new Date(b.created_at).toLocaleDateString()},${b.status || 'N/A'},${b.total_amount || 0},${b.total_months || 0} months\n`;
    });
  }

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

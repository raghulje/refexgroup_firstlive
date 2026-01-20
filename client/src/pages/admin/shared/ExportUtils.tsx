/**
 * Export utilities for PDF, CSV, and Excel
 */

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    csvHeaders.join(','), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return '';
        // Handle objects/arrays
        if (typeof value === 'object') return JSON.stringify(value);
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to Excel (using CSV format, can be enhanced with xlsx library)
 */
export const exportToExcel = (data: any[], filename: string, headers?: string[]) => {
  // For now, export as CSV (Excel can open CSV files)
  // To create proper .xlsx files, you'd need a library like 'xlsx'
  exportToCSV(data, filename, headers);
};

/**
 * Export data to PDF (using browser print functionality)
 */
export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Element not found');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  // Get styles
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  // Write content
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          ${styles}
          body { margin: 0; padding: 20px; }
          @media print {
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    // Optionally close after printing
    // printWindow.close();
  }, 250);
};

/**
 * Export table to PDF (enhanced version)
 */
export const exportTableToPDF = (tableId: string, filename: string, title?: string) => {
  const table = document.getElementById(tableId);
  if (!table) {
    alert('Table not found');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  const styles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      h1 { color: #333; }
      @media print {
        @page { margin: 1cm; }
        body { margin: 0; }
      }
    </style>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        ${styles}
      </head>
      <body>
        ${title ? `<h1>${title}</h1>` : ''}
        ${table.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

/**
 * Export audit logs
 */
export const exportAuditLogs = async (logs: any[], format: 'csv' | 'pdf' | 'excel') => {
  const formattedData = logs.map(log => ({
    'Date': new Date(log.createdAt).toLocaleString(),
    'User': log.user?.username || 'System',
    'Action': log.action,
    'Entity Type': log.entityType,
    'Entity ID': log.entityId || 'N/A',
    'Description': log.description || '',
    'IP Address': log.ipAddress || 'N/A',
  }));

  if (format === 'csv' || format === 'excel') {
    exportToCSV(formattedData, `audit-logs-${new Date().toISOString().split('T')[0]}`, Object.keys(formattedData[0]));
  } else {
    // For PDF, create a temporary table
    const tempId = 'temp-export-table';
    const tempTable = document.createElement('table');
    tempTable.id = tempId;
    tempTable.innerHTML = `
      <thead>
        <tr>
          ${Object.keys(formattedData[0]).map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${formattedData.map(row => `
          <tr>
            ${Object.values(row).map(v => `<td>${v}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;
    document.body.appendChild(tempTable);
    exportTableToPDF(tempId, `audit-logs-${new Date().toISOString().split('T')[0]}`, 'Audit Logs Report');
    document.body.removeChild(tempTable);
  }
};

/**
 * Export activity logs
 */
export const exportActivityLogs = async (activities: any[], format: 'csv' | 'pdf' | 'excel') => {
  const formattedData = activities.map(activity => ({
    'Date': new Date(activity.createdAt).toLocaleString(),
    'User': activity.user?.username || 'System',
    'Activity Type': activity.activityType,
    'Title': activity.title,
    'Description': activity.description || '',
    'Entity Type': activity.entityType || 'N/A',
    'Entity ID': activity.entityId || 'N/A',
    'Read': activity.isRead ? 'Yes' : 'No',
  }));

  if (format === 'csv' || format === 'excel') {
    exportToCSV(formattedData, `activity-logs-${new Date().toISOString().split('T')[0]}`, Object.keys(formattedData[0]));
  } else {
    const tempId = 'temp-export-table';
    const tempTable = document.createElement('table');
    tempTable.id = tempId;
    tempTable.innerHTML = `
      <thead>
        <tr>
          ${Object.keys(formattedData[0]).map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${formattedData.map(row => `
          <tr>
            ${Object.values(row).map(v => `<td>${v}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;
    document.body.appendChild(tempTable);
    exportTableToPDF(tempId, `activity-logs-${new Date().toISOString().split('T')[0]}`, 'Activity Logs Report');
    document.body.removeChild(tempTable);
  }
};


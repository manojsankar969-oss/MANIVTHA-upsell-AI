import { jsPDF } from 'jspdf';

/**
 * Utility function to generate and download a PDF representation of the generated script.
 * @param {Object} scriptRecord - The generation database record containing ai_response, staff_name, created_at, etc.
 */
export const downloadScriptPdf = (scriptRecord) => {
  if (!scriptRecord || !scriptRecord.ai_response) {
    console.error('Cannot generate PDF: Script record or content is missing.');
    return;
  }

  const doc = new jsPDF();
  
  // Format long script response to fit page width
  const splitText = doc.splitTextToSize(scriptRecord.ai_response, 180);
  
  // Header: Company Name
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text('Manivtha Tours & Travels', 15, 20);
  
  // Title: Document Description
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('AI Generated Upsell Script', 15, 30);
  
  // Meta Details: Staff Member & Date Generated
  const dateStr = scriptRecord.created_at 
    ? new Date(scriptRecord.created_at).toLocaleDateString() 
    : new Date().toLocaleDateString();
  const staffStr = scriptRecord.staff_name || 'N/A';
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Staff: ${staffStr} | Date: ${dateStr}`, 15, 38);
  
  // Horizontal Rule
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(15, 42, 195, 42);
  
  // Script Content
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.text(splitText, 15, 50);
  
  // Save/Download File
  const recordId = scriptRecord.id || 'new';
  doc.save(`upsell_script_${recordId}.pdf`);
};

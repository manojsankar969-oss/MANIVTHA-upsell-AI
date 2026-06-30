import { jsPDF } from 'jspdf';

/**
 * Utility function to generate and download a premium PDF of the generated script.
 * @param {Object} record - The generation database record.
 */
export const downloadScriptPdf = (record) => {
  if (!record) {
    console.error('Cannot generate PDF: Record is missing.');
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Color Palette
  const PRIMARY = [79, 70, 229]; // Indigo 600
  const TEXT_MAIN = [15, 23, 42]; // Slate 900
  const TEXT_MUTED = [100, 116, 139]; // Slate 500
  const BG_LIGHT = [248, 250, 252]; // Slate 50
  
  const drawHeader = () => {
    // Top colored banner
    doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');
    
    // Logo / Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('MANIVTHA TOURS & TRAVELS', 15, 18);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('AI-Powered Package Upgrade Script', 15, 23);
    
    // Date
    const dateStr = new Date(record.created_at || new Date()).toLocaleString('en-IN');
    doc.text(`Generated: ${dateStr}`, pageWidth - 15, 18, { align: 'right' });
    
    // Horizontal Rule
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 26, pageWidth - 15, 26);
  };

  const drawFooter = (pageNumber, totalPages) => {
    const y = pageHeight - 10;
    
    // Horizontal Rule
    doc.setDrawColor(241, 245, 249);
    doc.line(15, y - 4, pageWidth - 15, y - 4);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    
    // Security Watermark
    const staffName = (record.staff_name || 'Staff').toUpperCase();
    const watermarkText = `SECURE EXPORT • BY ${staffName} • CONFIDENTIAL & PROPRIETARY`;
    doc.text(watermarkText, 15, y);
    
    // Page Numbers
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, y, { align: 'right' });
  };

  // --- PAGE 1 CONTENT ---
  drawHeader();
  let y = 34;

  // 1. Customer Profile Grid Box
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 32, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text('CUSTOMER PROFILE & BOOKING CONTEXT', 20, y + 6);
  
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
  doc.text('Customer Name:', 20, y + 14);
  doc.text('Destination:', 20, y + 20);
  doc.text('Trip Duration:', 20, y + 26);

  doc.text('Current Vehicle:', 110, y + 14);
  doc.text('Price Quoted (INR):', 110, y + 20);
  doc.text('Assigned Staff:', 110, y + 26);

  doc.setFont('helvetica', 'normal');
  doc.text(record.customer_name || 'N/A', 50, y + 14);
  doc.text(record.destination || 'N/A', 50, y + 20);
  doc.text(record.trip_duration || 'N/A', 50, y + 26);

  doc.text(record.current_vehicle || 'N/A', 145, y + 14);
  doc.text(record.current_price ? `INR ${record.current_price}` : 'N/A', 145, y + 20);
  doc.text(record.staff_name || 'N/A', 145, y + 26);

  y += 40;

  // 2. Recommended Upgrade Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text('RECOMMENDED UPGRADE PROPOSAL', 15, y);
  
  doc.setFontSize(12);
  doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
  doc.text(record.recommended_upgrade || 'Premium Package Upgrade', 15, y + 6);
  
  y += 14;

  // 3. Pricing Comparison
  const pricingComparison = record.pricing_comparison || '';
  if (pricingComparison) {
    // Check page space
    if (y + 28 > pageHeight - 20) {
      drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages() + 1);
      doc.addPage();
      drawHeader();
      y = 34;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('PRICING COMPARISON', 15, y);
    y += 5;

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    const splitPricing = doc.splitTextToSize(pricingComparison, 170);
    doc.rect(15, y, pageWidth - 30, (splitPricing.length * 5.5) + 8, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    let pricingY = y + 6;
    splitPricing.forEach((line) => {
      doc.text(line, 20, pricingY);
      pricingY += 5.5;
    });

    y = pricingY + 6;
  }

  // 4. Why Upgrade & Benefits
  const isStructured = !!record.suggested_script;
  if (isStructured) {
    // Why Upgrade
    if (y + 20 > pageHeight - 20) {
      drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages() + 1);
      doc.addPage();
      drawHeader();
      y = 34;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('Why Customer Should Upgrade:', 15, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    
    const whyUpgrade = Array.isArray(record.why_upgrade)
      ? record.why_upgrade
      : (typeof record.why_upgrade === 'string' ? JSON.parse(record.why_upgrade) : []);
      
    whyUpgrade.forEach((point) => {
      const splitPoint = doc.splitTextToSize(`• ${point}`, 175);
      doc.text(splitPoint, 15, y + 5);
      y += (splitPoint.length * 4.5) + 1;
    });

    y += 5;

    // Expected Benefits
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('Expected Benefits:', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    const expectedBenefits = Array.isArray(record.expected_benefits)
      ? record.expected_benefits
      : (typeof record.expected_benefits === 'string' ? JSON.parse(record.expected_benefits) : []);

    expectedBenefits.forEach((benefit) => {
      doc.text(`[x] ${benefit}`, 15, y + 5);
      y += 5;
    });
    
    y += 8;
  }

  // 5. Objection Handling Section
  const objectionHandling = Array.isArray(record.objection_handling)
    ? record.objection_handling
    : (typeof record.objection_handling === 'string' ? JSON.parse(record.objection_handling) : []);

  if (objectionHandling.length > 0) {
    if (y + 25 > pageHeight - 20) {
      drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages() + 1);
      doc.addPage();
      drawHeader();
      y = 34;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('OBJECTION HANDLING', 15, y);
    y += 6;

    objectionHandling.forEach((item) => {
      const objection = item.objection || '';
      const rebuttal = item.rebuttal || '';

      if (y + 20 > pageHeight - 20) {
        drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages() + 1);
        doc.addPage();
        drawHeader();
        y = 34;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
        doc.text('OBJECTION HANDLING (continued)', 15, y);
        y += 6;
      }

      // Objection box
      doc.setFillColor(255, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.rect(15, y, pageWidth - 30, 10, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(220, 38, 38);
      doc.text(`Customer: ${objection}`, 20, y + 7);

      y += 12;

      // Rebuttal box
      const splitRebuttal = doc.splitTextToSize(rebuttal, 160);
      const rebuttalBoxH = (splitRebuttal.length * 5) + 8;
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.rect(15, y, pageWidth - 30, rebuttalBoxH, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 48, 163);
      let rebY = y + 6;
      doc.text('Staff Response:', 20, rebY);
      rebY += 5;
      splitRebuttal.forEach((line) => {
        doc.text(line, 20, rebY);
        rebY += 5;
      });

      y = y + rebuttalBoxH + 8;
    });

    y += 4;
  }

  // 6. Suggested Script Section
  // Check if we need to add a page before starting the script
  const scriptText = record.suggested_script || record.ai_response;
  const splitScript = doc.splitTextToSize(scriptText, 170);
  const scriptBoxHeight = (splitScript.length * 5.5) + 10;
  
  if (y + 25 > pageHeight - 20 || y + scriptBoxHeight > pageHeight - 20) {
    drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages() + 1);
    doc.addPage();
    drawHeader();
    y = 34;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text('SUGGESTED SALES SCRIPT', 15, y);
  
  y += 5;

  // Draw script box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.rect(15, y, pageWidth - 30, (splitScript.length * 5.5) + 8, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
  
  let scriptY = y + 6;
  splitScript.forEach((line) => {
    doc.text(line, 20, scriptY);
    scriptY += 5.5;
  });

  // 5. Apply Page Numbers to All Pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // Save/Download File
  const customerCleanName = (record.customer_name || 'customer').replace(/\s+/g, '_');
  doc.save(`manivtha_upsell_${customerCleanName}.pdf`);
};

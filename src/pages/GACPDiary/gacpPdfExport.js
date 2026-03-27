/**
 * GACP-WHO Diary — PDF Export Engine
 *
 * Generates professional GACP-WHO compliant PDF reports.
 * Each entry type produces its own table matching the official GACP-WHO forms.
 *
 * Uses lazy import so jspdf only loads when user clicks "Xuất PDF".
 * Loads Roboto font from /fonts/ to support Vietnamese diacritics.
 *
 * @see gacpConstants.js for type definitions
 */
import { GACP_ENTRY_TYPES, GACP_TYPE_MAP } from './gacpConstants';

/**
 * Convert ArrayBuffer to base64 string for jsPDF font registration.
 */
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
}

/**
 * Load and register Vietnamese-compatible font with jsPDF.
 * Falls back silently if font file is unavailable.
 */
async function registerVietnameseFont(doc) {
    try {
        const response = await fetch('/fonts/Roboto-Regular.ttf');
        if (!response.ok) throw new Error(`Font fetch failed: ${response.status}`);
        const buffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(buffer);

        doc.addFileToVFS('Roboto-Regular.ttf', base64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto', 'normal');
        return true;
    } catch (err) {
        console.warn('[GACP PDF] Could not load Vietnamese font, falling back to default:', err.message);
        return false;
    }
}

/**
 * Export GACP diary entries as a PDF file.
 *
 * @param {Object} cover - Cover page metadata
 * @param {Array}  entries - Array of GACP entry objects
 * @param {Object} options - { filterType?: string }
 */
export async function exportGacpPdf(cover, entries, options = {}) {
    // Lazy load jspdf to keep main bundle small
    const { jsPDF } = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default || autoTableModule;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // ─── Load Vietnamese font ───────────────────
    const hasViFont = await registerVietnameseFont(doc);
    const fontName = hasViFont ? 'Roboto' : 'helvetica';

    // ─── Cover Page ─────────────────────────────
    doc.setFont(fontName, 'normal');
    doc.setFontSize(14);
    doc.text(cover.companyName || 'CÔNG TY', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(18);
    doc.text('NHẬT KÝ VÙNG TRỒNG DƯỢC LIỆU', pageWidth / 2, 50, { align: 'center' });
    doc.text(`${cover.herbName || ''}`, pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.text('THEO GACP - WHO', pageWidth / 2, 72, { align: 'center' });

    doc.setFontSize(10);
    const infoY = 90;
    doc.text(`Cơ sở: ${cover.zoneName || ''}`, 40, infoY);
    doc.text(`Địa chỉ: ${cover.address || ''}`, 40, infoY + 8);
    doc.text(`Ngày ban hành: ${cover.issueDate || ''}`, 40, infoY + 16);
    doc.text(`Mã số lô: ${cover.lotCode || ''}`, 40, infoY + 24);

    // ─── Group entries by type ──────────────────
    const typesToExport = options.filterType ? [options.filterType] : GACP_ENTRY_TYPES.map((t) => t.id);

    typesToExport.forEach((typeId) => {
        const typeConfig = GACP_TYPE_MAP[typeId];
        if (!typeConfig) return;

        const typeEntries = entries.filter((e) => e.type === typeId);
        if (typeEntries.length === 0) return;

        doc.addPage();

        // Table title
        doc.setFont(fontName, 'normal');
        doc.setFontSize(11);
        doc.text(typeConfig.pdfTitle, pageWidth / 2, 15, { align: 'center' });

        // Build table data using full columnLabels (not abbreviated ones)
        const fullLabels = typeConfig.columnLabels;
        const head = [['STT', 'Ngày', ...fullLabels, 'Ghi chú']];
        const body = typeEntries.map((entry, idx) => [
            idx + 1,
            entry.date,
            ...typeConfig.columns.map((col) => {
                const val = entry.data[col] || '';
                // Resolve select values to labels
                if (typeConfig.columnOptions && typeConfig.columnOptions[col]) {
                    const opt = typeConfig.columnOptions[col].find((o) => o.value === val);
                    return opt ? opt.label : val;
                }
                return val;
            }),
            entry.note || '',
        ]);

        autoTable(doc, {
            startY: 22,
            head,
            body,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
                font: fontName,
            },
            headStyles: {
                fillColor: [22, 163, 74],
                textColor: [255, 255, 255],
                fontStyle: 'normal',
                halign: 'center',
                font: fontName,
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 10, right: 10 },
        });
    });

    // ─── Save ───────────────────────────────────
    const fileName = `NhatKy_GACP_${cover.herbName || 'DuocLieu'}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    return fileName;
}

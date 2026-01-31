/**
 * THE RECOVERY KERNEL - Document Generation Template
 * 
 * This template provides the standard formatting, colors, and structure
 * for generating protocol documents in any language.
 * 
 * USAGE:
 * 1. Copy this template
 * 2. Update LANG_CODE and translations in the CONFIG section
 * 3. Add protocol content
 * 4. Run with: node your_protocol_file.js
 * 
 * All color codes, typography, and structure match the master manifest.
 */

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak } = require('docx');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION - UPDATE THESE FOR EACH LANGUAGE/PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  LANG_CODE: "ES", // ES, FR, DE, PT, RU, IT, ZH, JA, KO, AR, HI
  PROTOCOL_NUM: "XX",
  OUTPUT_PATH: "/mnt/user-data/outputs/",
  OUTPUT_FILENAME: "Protocolo_XX_Title_ES.docx"
};

// Core terminology - translate these for each target language
const TERMS = {
  project_title: "EL NÚCLEO DE RECUPERACIÓN",
  supplemental_modules: "Módulos de Parche Suplementarios 01-36",
  protocol: "PROTOCOLO",
  section: "Sección",
  module: "Módulo",
  end_of_protocol: "FIN DEL PROTOCOLO",
  architects_log: "🔧 BITÁCORA DEL ARQUITECTO",
  system_stable: "✅ SISTEMA ESTABLE",
  critical_failure: "🛑 FALLO CRÍTICO DEL SISTEMA",
  system_alert: "⚠️ ALERTA DEL SISTEMA",
  key_takeaways: "CONCLUSIONES CLAVE",
  signature: "— El Arquitecto de Sistemas"
};

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SCHEME - DO NOT MODIFY (matches master manifest)
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  green: "C6EFCE",   // System Stable - solutions, protocols, positive outcomes
  red: "FFC7CE",     // Critical Failure - problems, dangers, warnings
  yellow: "FFEB9C",  // System Alert - cautions, important notices
  beige: "F5F5DC",   // Architect's Log - narrative, philosophy, framing
  blue: "D6EAF8",    // Informational - categories, lists, options
  gray: "D9D9D9"     // Table headers
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY - DO NOT MODIFY (matches master manifest)
// ═══════════════════════════════════════════════════════════════════════════

const typography = {
  font: "Arial",
  sizes: {
    project_title: 32,
    protocol_number: 36,
    protocol_title: 32,
    protocol_subtitle: 24,
    section_title: 28,
    section_subtitle: 24,
    box_title: 24,
    body_text: 22,
    table_header: 18,
    table_body: 18,
    footer: 24,
    separator: 24
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BORDER DEFINITIONS - DO NOT MODIFY
// ═══════════════════════════════════════════════════════════════════════════

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - REUSABLE ACROSS ALL PROTOCOLS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a colored content box with title and content lines
 * 
 * @param {string} title - Box title (include emoji prefix from TERMS)
 * @param {string[]} content - Array of text lines
 * @param {string} color - Color key from colors object (green, red, yellow, beige, blue)
 * @returns {Table} Formatted box as a table
 * 
 * Usage:
 *   createBox(TERMS.architects_log, ["Line 1", "Line 2", TERMS.signature], colors.beige)
 *   createBox(TERMS.critical_failure + " — Specific Issue", ["Content..."], colors.red)
 */
function createBox(title, content, color) {
  const paragraphs = [];
  paragraphs.push(new Paragraph({ 
    children: [new TextRun({ text: title, bold: true, size: typography.sizes.box_title })] 
  }));
  content.forEach(line => {
    paragraphs.push(new Paragraph({ 
      children: [new TextRun({ text: line, size: typography.sizes.body_text })] 
    }));
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        shading: { fill: color, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: paragraphs
      })]
    })]
  });
}

/**
 * Creates a data table with gray headers and white data rows
 * 
 * @param {string[]} headers - Array of column header texts
 * @param {string[][]} rows - 2D array of row data
 * @returns {Table} Formatted data table
 * 
 * Usage:
 *   createDataTable(
 *     ["Column 1", "Column 2", "Column 3"],
 *     [
 *       ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
 *       ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
 *     ]
 *   )
 */
function createDataTable(headers, rows) {
  const headerCells = headers.map(h => new TableCell({
    borders,
    shading: { fill: colors.gray, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: typography.sizes.table_header })] })]
  }));
  const dataRows = rows.map(row => new TableRow({
    children: row.map(cell => new TableCell({
      borders,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: typography.sizes.table_body })] })]
    }))
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerCells }), ...dataRows]
  });
}

/**
 * Creates a colored section header bar
 * 
 * @param {string} text - Header text
 * @param {string} color - Color key from colors object
 * @returns {Table} Formatted section header
 */
function createSectionHeader(text, color) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        shading: { fill: color, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ 
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: text, bold: true, size: typography.sizes.box_title })] 
        })]
      })]
    })]
  });
}

/**
 * Creates standard document header (project title + modules line + separator)
 * @returns {Paragraph[]} Array of header paragraphs
 */
function createDocumentHeader() {
  return [
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      children: [new TextRun({ text: TERMS.project_title, bold: true, size: typography.sizes.project_title })] 
    }),
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      children: [new TextRun({ text: TERMS.supplemental_modules, italics: true, size: typography.sizes.body_text })] 
    }),
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      spacing: { after: 200 },
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: typography.sizes.separator })] 
    })
  ];
}

/**
 * Creates protocol title block
 * @param {string} protocolNum - Protocol number (e.g., "36", "35Sc")
 * @param {string} title - Protocol title
 * @param {string} subtitle - Protocol subtitle (optional, pass "" if none)
 * @returns {Paragraph[]} Array of title paragraphs
 */
function createProtocolTitle(protocolNum, title, subtitle) {
  const elements = [
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      spacing: { before: 400 },
      children: [new TextRun({ text: `${TERMS.protocol} ${protocolNum}`, bold: true, size: typography.sizes.protocol_number })] 
    }),
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: typography.sizes.separator })] 
    }),
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      children: [new TextRun({ text: title, bold: true, size: typography.sizes.protocol_title })] 
    })
  ];
  
  if (subtitle) {
    elements.push(new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      spacing: { after: 400 },
      children: [new TextRun({ text: subtitle, italics: true, size: typography.sizes.protocol_subtitle })] 
    }));
  } else {
    elements[elements.length - 1].spacing = { after: 400 };
  }
  
  return elements;
}

/**
 * Creates section title with optional subtitle
 * @param {string} sectionNum - Section number (e.g., "36.1")
 * @param {string} title - Section title
 * @param {string} subtitle - Section subtitle (optional)
 * @returns {Paragraph[]} Array of section title paragraphs
 */
function createSectionTitle(sectionNum, title, subtitle) {
  const elements = [
    new Paragraph({ 
      spacing: { before: 400 }, 
      children: [new TextRun({ text: `${TERMS.section} ${sectionNum}: ${title}`, bold: true, size: typography.sizes.section_title })] 
    })
  ];
  
  if (subtitle) {
    elements.push(new Paragraph({ 
      children: [new TextRun({ text: subtitle, italics: true, size: typography.sizes.section_subtitle })] 
    }));
  }
  
  return elements;
}

/**
 * Creates document footer (separator + end line)
 * @param {string} protocolNum - Protocol number
 * @param {string} title - Protocol title
 * @returns {Paragraph[]} Array of footer paragraphs
 */
function createDocumentFooter(protocolNum, title) {
  return [
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      spacing: { before: 400 }, 
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: typography.sizes.separator })] 
    }),
    new Paragraph({ 
      alignment: AlignmentType.CENTER, 
      children: [new TextRun({ text: `${TERMS.end_of_protocol} ${protocolNum} — ${title}`, bold: true, size: typography.sizes.footer })] 
    })
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT CONTENT - BUILD YOUR PROTOCOL HERE
// ═══════════════════════════════════════════════════════════════════════════

const doc = new Document({
  styles: {
    default: { document: { run: { font: typography.font, size: typography.sizes.body_text } } }
  },
  sections: [{
    properties: {
      page: { 
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Document Header
      ...createDocumentHeader(),
      
      // Protocol Title
      ...createProtocolTitle(
        CONFIG.PROTOCOL_NUM,
        "PROTOCOL TITLE HERE",
        "Protocol Subtitle Here"
      ),

      // Opening Architect's Log
      createBox(TERMS.architects_log, [
        "",
        "Opening narrative content...",
        "",
        "More content...",
        "",
        TERMS.signature
      ], colors.beige),

      // Section Title
      ...createSectionTitle("XX.1", "SECTION TITLE", "Section Subtitle"),

      // Critical Failure Box (Red)
      createBox(TERMS.critical_failure + " — Specific Issue", [
        "",
        "Problem description...",
        "",
        "Consequences...",
        ""
      ], colors.red),

      // System Stable Box (Green)  
      createBox(TERMS.system_stable + " — The Solution", [
        "",
        "Solution description...",
        "",
        "Steps/protocol...",
        ""
      ], colors.green),

      // System Alert Box (Yellow)
      createBox(TERMS.system_alert + " — Warning Title", [
        "",
        "Warning content...",
        ""
      ], colors.yellow),

      // Data Table
      createDataTable(
        ["Header 1", "Header 2", "Header 3"],
        [
          ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
          ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
        ]
      ),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // More sections as needed...

      // Document Footer
      ...createDocumentFooter(CONFIG.PROTOCOL_NUM, "PROTOCOL TITLE HERE")
    ]
  }]
});

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE FILE
// ═══════════════════════════════════════════════════════════════════════════

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(CONFIG.OUTPUT_PATH + CONFIG.OUTPUT_FILENAME, buffer);
  console.log(`${TERMS.protocol} ${CONFIG.PROTOCOL_NUM} (${CONFIG.LANG_CODE}) created successfully!`);
  console.log('Size:', buffer.length, 'bytes');
});

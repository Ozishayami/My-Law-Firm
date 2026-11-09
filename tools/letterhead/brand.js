/*
 * Shared Trueworth document system: colours, fonts, A4 geometry, the letterhead
 * header and footer, Word styles and table helpers. Used by build-letter.js,
 * build-invoice.js and build-receipt.js so every document matches.
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Tab, TabStopType,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, TableLayoutType,
  PageNumber, LevelFormat, VerticalAlign, ShadingType,
} = require("docx");

const ROOT = path.resolve(__dirname, "..", "..");

// ---------- brand ----------
const C = {
  TEAL: "0D5E70",
  INK: "16252B",
  MUTED: "54656B",
  RULE: "D5DCDE", // light divider between table rows
  TINT: "E8F0F2", // pale teal panel
};
const F = { SERIF: "Source Serif 4", SANS: "Hanken Grotesk", SANS_SEMI: "Hanken Grotesk SemiBold" };

// ---------- page geometry (twentieths of a point; 567 = 1 cm) ----------
const A4 = { width: 11906, height: 16838 };
const MARGIN = { top: 2154, bottom: 1814, left: 1417, right: 1417, header: 709, footer: 567 }; // 38 / 32 / 25 / 25 / 12.5 / 10 mm
const TEXT_W = A4.width - MARGIN.left - MARGIN.right; // 9072 = 160 mm

// ---------- logo ----------
const svg = fs.readFileSync(path.join(ROOT, "brand/logo/trueworth-wordmark.svg"));
const png = fs.readFileSync(path.join(ROOT, "brand/logo/trueworth-wordmark-teal.png"));
const logo = (widthPx) => new ImageRun({
  type: "svg",
  data: svg,
  fallback: { type: "png", data: png },
  transformation: { width: widthPx, height: Math.round((widthPx * 28) / 150 * 10) / 10 },
  altText: { name: "Trueworth", description: "Trueworth wordmark", title: "Trueworth" },
});

// ---------- small helpers ----------
const label = (text, extra = {}) => new TextRun({ text, style: "TWLabel", ...extra });
const p = (text, opts = {}) => new Paragraph({ children: [new TextRun(text)], ...opts });
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };
const line = (color = C.RULE, size = 4) => ({ style: BorderStyle.SINGLE, size, color });

/** A "LABEL<tab>value" line: small teal capitals, then the value aligned at `tab`. */
const fieldLine = (lab, value, { tab = 1134, after = 40, style = "TWReference" } = {}) => new Paragraph({
  style,
  spacing: { after },
  tabStops: [{ type: TabStopType.LEFT, position: tab }],
  children: [label(lab), new TextRun({ children: [new Tab(), value] })],
});

// ---------- header and footer ----------
const firstHeader = () => new Header({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
      children: [logo(166), new TextRun({ children: [new Tab(), "ATTORNEYS & SOLICITORS"], style: "TWLabel" })],
    }),
  ],
});

const nextHeader = () => new Header({
  children: [new Paragraph({ style: "TWHeaderFooter", children: [logo(118)] })],
});

const footCell = (heading, lines) => new TableCell({
  width: { size: TEXT_W / 3, type: WidthType.DXA },
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
  margins: { top: 0, bottom: 0, left: 0, right: 113 },
  verticalAlign: VerticalAlign.TOP,
  children: [
    new Paragraph({ style: "TWHeaderFooter", spacing: { after: 40 }, children: [label(heading)] }),
    ...lines.map((l) => new Paragraph({ style: "TWFooterText", children: [new TextRun(l)] })),
  ],
});

const firstFooter = () => new Footer({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      spacing: { after: 140 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.TEAL, space: 1 } },
      children: [],
    }),
    new Table({
      width: { size: TEXT_W, type: WidthType.DXA },
      columnWidths: [TEXT_W / 3, TEXT_W / 3, TEXT_W / 3],
      layout: TableLayoutType.FIXED,
      borders: noBorders,
      rows: [new TableRow({
        children: [
          footCell("OFFICE", ["Office address line 1", "City, Postcode"]),
          footCell("CONTACT", ["+00 (0)00 0000 0000", "info@trueworth.example", "trueworth.example"]),
          footCell("REGULATION", ["[Regulator]", "[Registration number]"]),
        ],
      })],
    }),
  ],
});

const nextFooter = () => new Footer({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.TEAL, space: 6 } },
      tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
      children: [
        new TextRun({ text: "TRUEWORTH", style: "TWLabel" }),
        new TextRun({ children: [new Tab(), "Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], style: "TWFooterRun" }),
      ],
    }),
  ],
});

// ---------- tables ----------
/**
 * One table cell. `content` is a string, a TextRun array or a Paragraph array.
 * opts: w (DXA width), align ("left" | "right"), span, shade, top/bottom (border objects),
 *       first/last (drop the outer padding so text lines up with the margins), pad (top/bottom), run (TextRun options)
 */
const cell = (content, o = {}) => {
  const align = o.align === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT;
  let children;
  if (typeof content === "string") {
    children = [new Paragraph({ style: o.style || "TWCell", alignment: align, children: [new TextRun({ text: content, ...(o.run || {}) })] })];
  } else if (content.length && content[0] instanceof Paragraph) {
    children = content;
  } else {
    children = [new Paragraph({ style: o.style || "TWCell", alignment: align, children: content })];
  }
  const pad = o.pad ?? 90;
  return new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    columnSpan: o.span,
    shading: o.shade ? { type: ShadingType.CLEAR, fill: o.shade, color: "auto" } : undefined,
    borders: { top: o.top || noBorder, bottom: o.bottom || noBorder, left: o.left || noBorder, right: noBorder },
    margins: { top: o.padTop ?? pad, bottom: o.padBottom ?? pad, left: o.first ? 0 : (o.padX ?? 113), right: o.last ? 0 : (o.padX ?? 113) },
    verticalAlign: o.vAlign || VerticalAlign.TOP,
    children,
  });
};

const table = (columnWidths, rows) => new Table({
  width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths,
  layout: TableLayoutType.FIXED,
  borders: noBorders,
  rows,
});

const row = (cells, o = {}) => new TableRow({ children: cells, cantSplit: true, tableHeader: o.header });

// ---------- styles ----------
const auto = (lineVal) => ({ line: lineVal, lineRule: "auto" });

const styles = {
  default: {
    document: {
      run: { font: F.SERIF, size: 21, color: C.INK },
      paragraph: { spacing: { after: 160, ...auto(264) } },
    },
    heading1: {
      run: { font: F.SANS_SEMI, size: 15, color: C.TEAL, allCaps: true, characterSpacing: 24, bold: false },
      paragraph: { spacing: { before: 280, after: 120, ...auto(240) }, keepNext: true, keepLines: true },
    },
  },
  paragraphStyles: [
    { id: "TWTitle", name: "TW Title", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: F.SANS, size: 48, color: C.INK }, paragraph: { spacing: { after: 80, ...auto(240) }, keepNext: true } },
    { id: "TWSubject", name: "TW Subject", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: F.SANS_SEMI, size: 22, color: C.INK }, paragraph: { spacing: { after: 160, ...auto(252) }, keepNext: true } },
    { id: "TWAddress", name: "TW Address", basedOn: "Normal", quickFormat: true,
      paragraph: { spacing: { after: 0, ...auto(240) } } },
    { id: "TWReference", name: "TW Reference", basedOn: "Normal", quickFormat: true,
      run: { size: 19 }, paragraph: { spacing: { after: 40, ...auto(240) } } },
    { id: "TWSmall", name: "TW Small", basedOn: "Normal", quickFormat: true,
      run: { font: F.SANS, size: 16, color: C.MUTED }, paragraph: { spacing: { after: 0, ...auto(264) } } },
    { id: "TWSignatureName", name: "TW Signature Name", basedOn: "Normal", next: "TWAddress", quickFormat: true,
      run: { font: F.SANS_SEMI, size: 21, color: C.INK },
      paragraph: { spacing: { before: 700, after: 0, ...auto(240) }, keepNext: true, keepLines: true } },
    { id: "TWCell", name: "TW Table Text", basedOn: "Normal", quickFormat: true,
      run: { size: 19 }, paragraph: { spacing: { after: 0, ...auto(240) } } },
    { id: "TWHeaderFooter", name: "TW Header Footer", basedOn: "Normal",
      run: { font: F.SANS, size: 15, color: C.MUTED }, paragraph: { spacing: { after: 0, ...auto(240) } } },
    { id: "TWFooterText", name: "TW Footer Text", basedOn: "TWHeaderFooter",
      run: { font: F.SANS, size: 15, color: C.MUTED }, paragraph: { spacing: { after: 0, ...auto(252) } } },
  ],
  characterStyles: [
    { id: "TWLabel", name: "TW Label", quickFormat: true,
      run: { font: F.SANS_SEMI, size: 13, color: C.TEAL, characterSpacing: 24 } },
    { id: "TWFooterRun", name: "TW Footer Run", run: { font: F.SANS, size: 15, color: C.MUTED } },
  ],
};

const numbering = {
  config: [{
    reference: "tw-numbered",
    levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 567, hanging: 567 }, spacing: { after: 120 } } } },
      { level: 1, format: LevelFormat.LOWER_LETTER, text: "(%2)", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1134, hanging: 567 }, spacing: { after: 80 } } } },
      { level: 2, format: LevelFormat.LOWER_ROMAN, text: "(%3)", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1701, hanging: 567 }, spacing: { after: 120 } } } },
    ],
  }],
};

/** A complete Trueworth A4 document with the letterhead on page 1. */
const makeDocument = ({ title, description, children }) => new Document({
  creator: "Trueworth",
  title,
  description,
  styles,
  numbering,
  sections: [{
    properties: { titlePage: true, page: { size: A4, margin: MARGIN } },
    headers: { first: firstHeader(), default: nextHeader() },
    footers: { first: firstFooter(), default: nextFooter() },
    children,
  }],
});

const write = (doc, out) => Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log("wrote", out, buf.length, "bytes");
});

module.exports = { C, F, A4, MARGIN, TEXT_W, logo, label, p, line, noBorder, fieldLine, cell, table, row, makeDocument, write };

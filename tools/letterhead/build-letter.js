/*
 * Builds the Trueworth letter template (A4) as a .docx.
 *   node tools/letterhead/build-letter.js <out.docx> [--long]
 * --long adds extra paragraphs so the continuation-page header/footer can be checked.
 * Fonts are embedded afterwards by tools/letterhead/embed-fonts.py.
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Tab, TabStopType,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, TableLayoutType,
  PageNumber, LevelFormat, VerticalAlign, HeadingLevel,
} = require("docx");

const out = process.argv[2] || "Trueworth-Letter.docx";
const LONG = process.argv.includes("--long");
const ROOT = path.resolve(__dirname, "..", "..");

// ---------- brand ----------
const TEAL = "0D5E70";
const INK = "16252B";
const MUTED = "54656B";
const SERIF = "Source Serif 4";
const SANS = "Hanken Grotesk";
const SANS_SEMI = "Hanken Grotesk SemiBold";

// ---------- page geometry (twentieths of a point; 567 = 1 cm) ----------
const A4 = { width: 11906, height: 16838 };
const MARGIN = { top: 2154, bottom: 1814, left: 1417, right: 1417, header: 709, footer: 567 }; // 38 / 32 / 25 / 25 / 12.5 / 10 mm
const TEXT_W = A4.width - MARGIN.left - MARGIN.right; // 9072 = 160 mm
const REF_TAB = 1134; // 20 mm: aligns reference values

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

// ---------- helpers ----------
const label = (text) => new TextRun({ text, style: "TWLabel" });
const p = (text, opts = {}) => new Paragraph({ children: [new TextRun(text)], ...opts });
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };

// ---------- header: first page ----------
const firstHeader = new Header({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
      children: [logo(166), new TextRun({ children: [new Tab(), "ATTORNEYS & SOLICITORS"], style: "TWLabel" })],
    }),
  ],
});

// ---------- header: continuation pages ----------
const nextHeader = new Header({
  children: [new Paragraph({ style: "TWHeaderFooter", children: [logo(118)] })],
});

// ---------- footer: first page ----------
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

const firstFooter = new Footer({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      spacing: { after: 140 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 1 } },
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

// ---------- footer: continuation pages ----------
const nextFooter = new Footer({
  children: [
    new Paragraph({
      style: "TWHeaderFooter",
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 6 } },
      tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }],
      children: [
        new TextRun({ text: "TRUEWORTH", style: "TWLabel" }),
        new TextRun({ children: [new Tab(), "Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], style: "TWFooterRun" }),
      ],
    }),
  ],
});

// ---------- letter body ----------
const refLine = (lab, value, last = false) => new Paragraph({
  style: "TWReference",
  spacing: { after: last ? 260 : 30 },
  tabStops: [{ type: TabStopType.LEFT, position: REF_TAB }],
  children: [label(lab), new TextRun({ children: [new Tab(), value] })],
});

const body = [
  p("[Date]", { spacing: { after: 260 } }),
  refLine("OUR REF", "TW/[CLIENT]/[MATTER]"),
  refLine("YOUR REF", "[Their reference]", true),

  new Paragraph({ style: "TWHeaderFooter", spacing: { after: 100 }, children: [new TextRun({ text: "PRIVATE AND CONFIDENTIAL", style: "TWLabel", color: INK })] }),
  p("[Recipient name]", { style: "TWAddress" }),
  p("[Position]", { style: "TWAddress" }),
  p("[Company]", { style: "TWAddress" }),
  p("[Address line 1]", { style: "TWAddress" }),
  p("[City, Postcode]", { style: "TWAddress", spacing: { after: 100 } }),
  p("By email: [name@company.com]", { style: "TWSmall", spacing: { after: 360 } }),

  p("Dear [Name],", { spacing: { after: 180 } }),
  p("[Subject of the letter]", { style: "TWSubject" }),

  p("[Opening. Say in one or two sentences why you are writing and, where you are advising, what you recommend. The reader should know the answer by the end of this paragraph.]"),
  p("[Body. Set out the background and your reasoning in short paragraphs of no more than four sentences. Use plain English and explain any term the reader may not know.]"),

  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("[Optional heading]")] }),
  new Paragraph({ numbering: { reference: "tw-numbered", level: 0 }, children: [new TextRun("[Use numbered paragraphs for advice the client may want to refer back to.]")] }),
  new Paragraph({ numbering: { reference: "tw-numbered", level: 0 }, children: [new TextRun("[Break a point into lettered sub-paragraphs where it has parts:]")] }),
  new Paragraph({ numbering: { reference: "tw-numbered", level: 1 }, children: [new TextRun("[first part; and]")] }),
  new Paragraph({ numbering: { reference: "tw-numbered", level: 1 }, children: [new TextRun("[second part.]")] }),

  ...(LONG ? Array.from({ length: 9 }, (_, i) => p(`[Additional paragraph ${i + 1}, used only to check how the letter runs onto a second page. A continuation page carries a smaller wordmark at the top and the page number at the foot, so the reader always knows where they are in the letter.]`)) : []),

  p("[Next steps. Say what happens next, who does it and by when.]"),
  p("[Close. Invite the reader to call or email you with any questions.]", { spacing: { after: 260 } }),

  p("Yours sincerely,", { keepNext: true, keepLines: true, spacing: { after: 0 } }),
  new Paragraph({ style: "TWSignatureName", children: [new TextRun("[Full Name]")] }),
  p("[Position]", { style: "TWAddress", keepNext: true }),
  p("Trueworth", { style: "TWAddress", keepNext: true }),
  new Paragraph({
    style: "TWSmall",
    spacing: { before: 60, after: 0 },
    children: [new TextRun("T  +00 (0)00 0000 0000"), new TextRun({ text: "   ·   ", color: "B9C2C5" }), new TextRun("E  name@trueworth.example")],
  }),

  new Paragraph({ style: "TWSmall", spacing: { before: 280, after: 30 }, tabStops: [{ type: TabStopType.LEFT, position: 680 }], children: [label("ENC."), new TextRun({ children: [new Tab(), "[List of enclosures]"] })] }),
  new Paragraph({ style: "TWSmall", spacing: { after: 0 }, tabStops: [{ type: TabStopType.LEFT, position: 680 }], children: [label("CC"), new TextRun({ children: [new Tab(), "[Name, Company]"] })] }),
];

// ---------- document ----------
const doc = new Document({
  creator: "Trueworth",
  title: "Trueworth letter",
  description: "Trueworth letter template",
  styles: {
    default: {
      document: {
        run: { font: SERIF, size: 21, color: INK },
        paragraph: { spacing: { after: 160, line: 264, lineRule: "auto" } },
      },
      heading1: {
        run: { font: SANS_SEMI, size: 15, color: TEAL, allCaps: true, characterSpacing: 24, bold: false },
        paragraph: { spacing: { before: 280, after: 120, line: 240, lineRule: "auto" }, keepNext: true, keepLines: true },
      },
    },
    paragraphStyles: [
      { id: "TWSubject", name: "TW Subject", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: SANS_SEMI, size: 22, color: INK },
        paragraph: { spacing: { after: 160, line: 252, lineRule: "auto" }, keepNext: true } },
      { id: "TWAddress", name: "TW Address", basedOn: "Normal", quickFormat: true,
        paragraph: { spacing: { after: 0, line: 240, lineRule: "auto" } } },
      { id: "TWReference", name: "TW Reference", basedOn: "Normal", quickFormat: true,
        run: { size: 19 }, paragraph: { spacing: { after: 40, line: 240, lineRule: "auto" } } },
      { id: "TWSmall", name: "TW Small", basedOn: "Normal", quickFormat: true,
        run: { font: SANS, size: 16, color: MUTED }, paragraph: { spacing: { after: 0, line: 264, lineRule: "auto" } } },
      { id: "TWSignatureName", name: "TW Signature Name", basedOn: "Normal", next: "TWAddress", quickFormat: true,
        run: { font: SANS_SEMI, size: 21, color: INK },
        paragraph: { spacing: { before: 700, after: 0, line: 240, lineRule: "auto" }, keepNext: true, keepLines: true } },
      { id: "TWHeaderFooter", name: "TW Header Footer", basedOn: "Normal",
        run: { font: SANS, size: 15, color: MUTED }, paragraph: { spacing: { after: 0, line: 240, lineRule: "auto" } } },
      { id: "TWFooterText", name: "TW Footer Text", basedOn: "TWHeaderFooter",
        run: { font: SANS, size: 15, color: MUTED }, paragraph: { spacing: { after: 0, line: 252, lineRule: "auto" } } },
    ],
    characterStyles: [
      { id: "TWLabel", name: "TW Label", quickFormat: true,
        run: { font: SANS_SEMI, size: 13, color: TEAL, characterSpacing: 24 } },
      { id: "TWFooterRun", name: "TW Footer Run",
        run: { font: SANS, size: 15, color: MUTED } },
    ],
  },
  numbering: {
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
  },
  sections: [{
    properties: {
      titlePage: true,
      page: {
        size: A4,
        margin: MARGIN,
      },
    },
    headers: { first: firstHeader, default: nextHeader },
    footers: { first: firstFooter, default: nextFooter },
    children: body,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log("wrote", out, buf.length, "bytes");
});

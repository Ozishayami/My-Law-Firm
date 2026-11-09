/*
 * Builds the Trueworth letter template (A4) as a .docx.
 *   node tools/letterhead/build-letter.js <out.docx> [--long]
 * --long adds extra paragraphs so the continuation-page header/footer can be checked.
 * Fonts are embedded afterwards by tools/letterhead/embed-fonts.py.
 */
const { Paragraph, TextRun, Tab, TabStopType, HeadingLevel } = require("docx");
const { C, label, p, fieldLine, makeDocument, write } = require("./brand");

const out = process.argv[2] || "Trueworth-Letter.docx";
const LONG = process.argv.includes("--long");

const body = [
  p("[Date]", { spacing: { after: 260 } }),
  fieldLine("OUR REF", "TW/[CLIENT]/[MATTER]", { after: 30 }),
  fieldLine("YOUR REF", "[Their reference]", { after: 260 }),

  new Paragraph({ style: "TWHeaderFooter", spacing: { after: 100 }, children: [label("PRIVATE AND CONFIDENTIAL", { color: C.INK })] }),
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

write(makeDocument({ title: "Trueworth letter", description: "Trueworth letter template", children: body }), out);

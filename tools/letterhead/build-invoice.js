/*
 * Builds the Trueworth invoice template (A4) as a .docx.
 *   node tools/letterhead/build-invoice.js <out.docx>
 * Fonts are embedded afterwards by tools/letterhead/embed-fonts.py.
 */
const { Paragraph, TextRun, VerticalAlign } = require("docx");
const { C, F, TEXT_W, label, p, line, fieldLine, cell, table, row, makeDocument, write } = require("./brand");

const out = process.argv[2] || "Trueworth-Invoice.docx";

// ---------- title + parties ----------
const LEFT_W = 5072, RIGHT_W = TEXT_W - LEFT_W; // 5072 + 4000

const parties = table([LEFT_W, RIGHT_W], [row([
  cell([
    new Paragraph({ style: "TWCell", spacing: { after: 80 }, children: [label("BILL TO")] }),
    p("[Client name]", { style: "TWAddress" }),
    p("[Company]", { style: "TWAddress" }),
    p("[Address line 1]", { style: "TWAddress" }),
    p("[City, Postcode]", { style: "TWAddress", spacing: { after: 60 } }),
    p("[client@company.com]", { style: "TWSmall" }),
  ], { w: LEFT_W, first: true, pad: 0 }),
  cell([
    fieldLine("INVOICE NO.", "TW-INV-[0000]", { tab: 1474 }),
    fieldLine("DATE", "[Date]", { tab: 1474 }),
    fieldLine("DUE DATE", "[Date]", { tab: 1474 }),
    fieldLine("OUR REF", "TW/[CLIENT]/[MATTER]", { tab: 1474 }),
    fieldLine("YOUR REF", "[Their reference]", { tab: 1474 }),
    fieldLine("CURRENCY", "[Currency]", { tab: 1474, after: 0 }),
  ], { w: RIGHT_W, last: true, pad: 0 }),
])]);

// ---------- line items ----------
const W = [1250, 4122, 800, 1300, 1600]; // date, description, hours, rate, amount = 9072
const head = (t, i, right) => cell([label(t)], {
  w: W[i], align: right ? "right" : "left", first: i === 0,
  bottom: line(C.TEAL, 6), padTop: 0, padBottom: 80,
});
const section = (t) => row([cell(t, {
  w: TEXT_W, span: 5, first: true, last: true, padTop: 170, padBottom: 50,
  run: { font: F.SANS_SEMI, size: 19, color: C.INK },
})]);
const item = (date, desc, hours, rate, amount) => row([
  cell(date, { w: W[0], first: true, bottom: line(), pad: 70 }),
  cell(desc, { w: W[1], bottom: line(), pad: 70 }),
  cell(hours, { w: W[2], align: "right", bottom: line(), pad: 70 }),
  cell(rate, { w: W[3], align: "right", bottom: line(), pad: 70 }),
  cell(amount, { w: W[4], align: "right", bottom: line(), pad: 70 }),
]);

const items = table(W, [
  row([head("DATE", 0), head("DESCRIPTION", 1), head("HOURS", 2, true), head("RATE", 3, true), head("AMOUNT", 4, true)], { header: true }),
  section("Professional fees"),
  item("[Date]", "[e.g. Reviewed the draft agreement]", "[0.0]", "[0.00]", "[0.00]"),
  item("[Date]", "[Description of work done]", "[0.0]", "[0.00]", "[0.00]"),
  item("[Date]", "[Description of work done]", "[0.0]", "[0.00]", "[0.00]"),
  section("Disbursements"),
  item("[Date]", "[e.g. Court filing fee]", "", "", "[0.00]"),
  item("[Date]", "[Cost paid on your behalf]", "", "", "[0.00]"),
]);

// ---------- totals ----------
const T = [4972, 2500, 1600];
const totalLine = (lab, amount, last = false) => row([
  cell("", { w: T[0], first: true, pad: 50 }),
  cell(lab, { w: T[1], pad: 50, bottom: last ? undefined : line() }),
  cell(amount, { w: T[2], align: "right", pad: 50, bottom: last ? undefined : line() }),
]);
const totals = table(T, [
  totalLine("Professional fees", "[0.00]"),
  totalLine("Disbursements", "[0.00]"),
  totalLine("VAT on fees ([rate]%)", "[0.00]"),
  row([
    cell("", { w: T[0], first: true, pad: 0 }),
    cell([label("TOTAL DUE", { color: C.INK })], { w: T[1], shade: C.TINT, top: line(C.TEAL, 8), padTop: 150, padBottom: 150, vAlign: VerticalAlign.CENTER }),
    cell("[0.00]", { w: T[2], align: "right", shade: C.TINT, top: line(C.TEAL, 8), padTop: 150, padBottom: 150, padX: 113,
      run: { font: F.SANS_SEMI, size: 21, color: C.INK }, vAlign: VerticalAlign.CENTER }),
  ]),
]);

// ---------- payment ----------
const WARN_W = RIGHT_W - 113; // inside the right column's left padding
const warning = table([WARN_W], [row([cell([
  new Paragraph({ style: "TWCell", spacing: { after: 40 }, children: [label("PAYMENT FRAUD WARNING", { color: C.INK })] }),
  new Paragraph({
    style: "TWSmall",
    children: [new TextRun("We will never tell you by email that our bank details have changed. Before paying, call us on a number you already know to confirm them.")],
  }),
], { w: WARN_W, shade: C.TINT, left: line(C.TEAL, 18), padTop: 120, padBottom: 120, padX: 170 })])]);

const payment = table([LEFT_W, RIGHT_W], [row([
  cell([
    new Paragraph({ style: "TWCell", spacing: { after: 100 }, children: [label("PAYMENT DETAILS")] }),
    fieldLine("BANK", "[Bank name]", { tab: 1701 }),
    fieldLine("ACCOUNT NAME", "Trueworth", { tab: 1701 }),
    fieldLine("ACCOUNT NO.", "[0000000000]", { tab: 1701 }),
    fieldLine("BRANCH CODE", "[Sort or branch code]", { tab: 1701 }),
    fieldLine("SWIFT", "[SWIFT code]", { tab: 1701, after: 0 }),
  ], { w: LEFT_W, first: true, pad: 0 }),
  cell([
    new Paragraph({ style: "TWCell", spacing: { after: 100 }, children: [label("TERMS")] }),
    p("Payment is due within [14] days of the invoice date. Please use the invoice number as your payment reference.", { style: "TWReference", spacing: { after: 200 } }),
    warning,
    new Paragraph({ style: "TWCell", spacing: { after: 0, line: 20, lineRule: "exact" }, children: [] }),
  ], { w: RIGHT_W, last: true, pad: 0 }),
])]);

// ---------- document ----------
const gap = (after) => new Paragraph({ style: "TWCell", spacing: { after }, children: [] });

const body = [
  p("Invoice", { style: "TWTitle", spacing: { after: 320 } }),
  parties,
  gap(260),
  fieldLine("MATTER", "[Matter name]", { tab: 1134, after: 260, style: "TWAddress" }),
  items,
  gap(160),
  totals,
  gap(400),
  payment,
  p("Thank you for instructing Trueworth.", { style: "TWSmall", spacing: { before: 320 } }),
];

write(makeDocument({ title: "Trueworth invoice", description: "Trueworth invoice template", children: body }), out);

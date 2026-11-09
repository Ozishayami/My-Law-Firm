/*
 * Builds the Trueworth receipt template (A4) as a .docx.
 *   node tools/letterhead/build-receipt.js <out.docx>
 * Fonts are embedded afterwards by tools/letterhead/embed-fonts.py.
 */
const { Paragraph, TextRun } = require("docx");
const { C, F, TEXT_W, label, p, line, fieldLine, cell, table, row, makeDocument, write } = require("./brand");

const out = process.argv[2] || "Trueworth-Receipt.docx";

const LEFT_W = 4672, RIGHT_W = TEXT_W - LEFT_W; // 4672 + 4400

// ---------- parties ----------
const parties = table([LEFT_W, RIGHT_W], [row([
  cell([
    new Paragraph({ style: "TWCell", spacing: { after: 80 }, children: [label("RECEIVED FROM")] }),
    p("[Client name]", { style: "TWAddress" }),
    p("[Company]", { style: "TWAddress" }),
    p("[Address line 1]", { style: "TWAddress" }),
    p("[City, Postcode]", { style: "TWAddress" }),
  ], { w: LEFT_W, first: true, pad: 0 }),
  cell([
    fieldLine("RECEIPT NO.", "TW-RCT-[0000]", { tab: 1474 }),
    fieldLine("DATE RECEIVED", "[Date]", { tab: 1474 }),
    fieldLine("METHOD", "[Bank transfer]", { tab: 1474 }),
    fieldLine("PAYMENT REF", "[Payer's reference]", { tab: 1474 }),
    fieldLine("PAID INTO", "[Office or client account]", { tab: 1474, after: 0 }),
  ], { w: RIGHT_W, last: true, pad: 0 }),
])]);

// ---------- amount panel ----------
const amount = table([TEXT_W], [row([cell([
  new Paragraph({ style: "TWCell", spacing: { after: 80 }, children: [label("AMOUNT RECEIVED")] }),
  new Paragraph({ style: "TWCell", spacing: { after: 60 }, children: [new TextRun({ text: "[Currency] [0.00]", font: F.SANS, size: 44, color: C.INK })] }),
  new Paragraph({ style: "TWCell", children: [new TextRun({ text: "[Amount in words]", italics: true, color: C.MUTED })] }),
], { w: TEXT_W, shade: C.TINT, left: line(C.TEAL, 18), padTop: 220, padBottom: 220, padX: 284 })])]);

// ---------- applied to ----------
const W = [2000, 5472, 1600]; // invoice, matter, amount = 9072
const head = (t, i, right) => cell([label(t)], { w: W[i], align: right ? "right" : "left", first: i === 0, bottom: line(C.TEAL, 6), padTop: 0, padBottom: 90 });
const item = (inv, matter, amt) => row([
  cell(inv, { w: W[0], first: true, bottom: line() }),
  cell(matter, { w: W[1], bottom: line() }),
  cell(amt, { w: W[2], align: "right", bottom: line() }),
]);
const applied = table(W, [
  row([head("INVOICE NO.", 0), head("MATTER", 1), head("AMOUNT", 2, true)], { header: true }),
  item("TW-INV-[0000]", "[Matter name]", "[0.00]"),
  item("TW-INV-[0000]", "[Matter name]", "[0.00]"),
]);

const T = [4972, 2500, 1600];
const totals = table(T, [
  row([
    cell("", { w: T[0], first: true, pad: 50 }),
    cell([label("TOTAL RECEIVED", { color: C.INK })], { w: T[1], pad: 60, bottom: line() }),
    cell("[0.00]", { w: T[2], align: "right", pad: 60, bottom: line(), run: { font: F.SANS_SEMI, size: 19, color: C.INK } }),
  ]),
  row([
    cell("", { w: T[0], first: true, pad: 50 }),
    cell("Balance outstanding", { w: T[1], pad: 60 }),
    cell("[0.00]", { w: T[2], align: "right", pad: 60 }),
  ]),
]);

// ---------- signature ----------
const SIG_W = 4252; // 75 mm signature line
const signature = table([SIG_W, TEXT_W - SIG_W], [row([
  cell("", { w: SIG_W, first: true, bottom: line(C.INK, 4), padTop: 900, padBottom: 40 }),
  cell("", { w: TEXT_W - SIG_W, last: true, pad: 0 }),
])]);

// ---------- document ----------
const gap = (after) => new Paragraph({ style: "TWCell", spacing: { after }, children: [] });

const body = [
  p("Receipt", { style: "TWTitle", spacing: { after: 420 } }),
  parties,
  gap(420),
  amount,
  p("Trueworth confirms receipt of the amount above, applied as follows.", { spacing: { before: 420, after: 240 } }),
  applied,
  gap(160),
  totals,
  signature,
  p("Authorised signature", { style: "TWSmall", spacing: { before: 80 } }),
  p("[Full Name], [Position], for Trueworth", { style: "TWSmall" }),
  p("Please keep this receipt for your records.", { style: "TWSmall", spacing: { before: 480 } }),
];

write(makeDocument({ title: "Trueworth receipt", description: "Trueworth receipt template", children: body }), out);

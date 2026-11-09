# Trueworth brand files

Not published with the website (listed in `.vercelignore`).

```
logo/       Wordmark as SVG (teal and white) and high-resolution PNG
fonts/      Hanken Grotesk and Source Serif 4 (SIL Open Font License)
templates/  Letter, invoice and receipt: each as a .dotx template and a .docx, plus a preview
```

## Templates

| Document | Use every day | Same, as a plain document |
|---|---|---|
| Letter | `Trueworth-Letter-Template.dotx` | `Trueworth-Letter.docx` |
| Invoice | `Trueworth-Invoice-Template.dotx` | `Trueworth-Invoice.docx` |
| Receipt | `Trueworth-Receipt-Template.dotx` | `Trueworth-Receipt.docx` |

Double-click a `.dotx` and Word opens a new, untitled document from it, so the template itself is never overwritten.

All three share one layout: A4, 25 mm side margins, the wordmark at the top of page 1, and the office, contact and regulation details in the footer. Further pages carry a smaller wordmark and "Page x of y".

Text is set in Source Serif 4; headings, labels and the footer are in Hanken Grotesk. Both fonts are embedded in the files, so documents look the same on a computer that does not have them installed.

### Writing a letter

Replace each `[placeholder]` and delete the lines you do not need (for example "Private and confidential" or "Enc.").

Use the built-in styles (Home → Styles) instead of formatting by hand:

| Style | Use it for |
|---|---|
| Normal | Body text |
| TW Subject | The subject line under "Dear …" |
| Heading 1 | Small teal section headings inside a longer letter |
| TW Address | Recipient address and the lines under the signature |
| TW Reference | "Our ref" / "Your ref" lines |
| TW Small | "By email", contact line, enclosures and copies |
| TW Signature Name | The signer's name (leaves room above it for the signature) |
| TW Table Text | Text inside invoice and receipt tables |
| TW Label | Small teal capitals for labels (a character style) |

Numbered paragraphs: copy an existing numbered paragraph. Press Tab to turn `1.` into `(a)`, and Shift+Tab to go back.

### Invoices

- Number invoices `TW-INV-0001`, `TW-INV-0002` and so on, without gaps.
- State the currency once, in the details on the right; every amount on the invoice is in that currency.
- Keep professional fees and disbursements (costs paid on the client's behalf) in their own sections. Each section takes as many rows as you need: put the cursor in a row and use Layout → Insert Below.
- The tax line reads "VAT on fees ([rate]%)". Change the name and rate to whatever applies to you.
- Fill in the payment details once in the template. Under charter rule 4.3, the payment fraud warning stays on every invoice.

### Receipts

- Number receipts `TW-RCT-0001` and so on.
- "Paid into" must say whether the money went to the office account (fees) or the client account (money held for the client); see charter rules 4.1 and 4.2.
- Write the amount in words as well as in figures.
- List each invoice the payment settles, and show any balance still outstanding.

### One-time setup

1. Put the firm's real address, phone, email, website and regulator details into the footer of each `.dotx`, and the bank details into the invoice. To edit a template itself rather than start a new document, open it from Word (File → Open) or right-click it and choose **Open**. Double-click the footer area to edit it, then save.
2. Install the fonts on every firm computer: open each file in `fonts/` and click **Install**. The documents already display correctly without them, but installing them lets everyone type new text in the same fonts.

### Rebuilding

The templates are generated from `tools/letterhead/` (the shared header, footer and styles live in `brand.js`). To rebuild all three after a change:

```bash
tools/letterhead/build-all.sh
```

Footer and bank details can also be changed once in `brand.js` and `build-invoice.js`, so every rebuilt template carries them.

# Trueworth brand files

Not published with the website (listed in `.vercelignore`).

```
logo/        Wordmark as SVG (teal and white) and high-resolution PNG
fonts/       Hanken Grotesk and Source Serif 4 (SIL Open Font License)
letterhead/  Letter template (.dotx), the same letter as .docx, and a preview
```

## Letter template

- **`Trueworth-Letter-Template.dotx`**: double-click it and Word opens a new, untitled letter, so the template itself is never overwritten. This is the file to use every day.
- **`Trueworth-Letter.docx`**: the same letter as an ordinary document, for anyone who prefers to copy a file.

Layout: A4, 25 mm side margins, the wordmark at the top of page 1, and the office, contact and regulation details in the footer. Continuation pages carry a smaller wordmark and "Page x of y".

Text is set in Source Serif 4 at 10.5 pt; headings, labels and the footer are in Hanken Grotesk. Both fonts are embedded in the file, so the letter looks the same on a computer that does not have them installed.

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
| TW Label | Small teal capitals for labels (a character style) |

Numbered paragraphs: copy an existing numbered paragraph. Press Tab to turn `1.` into `(a)`, and Shift+Tab to go back.

### One-time setup

1. Put the firm's real address, phone, email, website and regulator details into the footer of the `.dotx`. To edit the template itself rather than start a new letter, open it from Word (File → Open) or right-click it and choose **Open**. Double-click the footer area to edit it, then save.
2. Install the fonts on every firm computer: open each file in `fonts/` and click **Install**. The letter already displays correctly without them, but installing them lets everyone type new text in the same fonts.

### Rebuilding

The template is generated, so changes to the layout belong in the scripts:

```bash
node tools/letterhead/build-letter.js /tmp/letter.docx
python3 tools/letterhead/embed-fonts.py /tmp/letter.docx brand/letterhead/Trueworth-Letter.docx --dotx brand/letterhead/Trueworth-Letter-Template.dotx
```

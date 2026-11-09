"""Embed the Trueworth fonts into a .docx (and optionally save a .dotx copy).

    python3 tools/letterhead/embed-fonts.py in.docx out.docx [--dotx out.dotx]

Word reads embedded fonts when they are not installed, so letters look right on any
computer. The fonts are SIL Open Font License, which allows embedding (fsType 0).
Settings also switch on "Embed fonts in the file" so Word keeps them when re-saving.
"""
import re
import sys
import uuid
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FONTS = ROOT / "brand" / "fonts"

# family name as Word sees it -> {embed slot: file}
FAMILIES = {
    "Source Serif 4": {
        "family": "roman",
        "files": {
            "embedRegular": "SourceSerif4_400Regular.ttf",
            "embedBold": "SourceSerif4_700Bold.ttf",
            "embedItalic": "SourceSerif4_400Regular_Italic.ttf",
            "embedBoldItalic": "SourceSerif4_700Bold_Italic.ttf",
        },
    },
    "Hanken Grotesk": {"family": "swiss", "files": {"embedRegular": "HankenGrotesk_400Regular.ttf"}},
    "Hanken Grotesk SemiBold": {"family": "swiss", "files": {"embedRegular": "HankenGrotesk_600SemiBold.ttf"}},
}
SLOT_ORDER = ["embedRegular", "embedBold", "embedItalic", "embedBoldItalic"]
REL_FONT = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font"
DOC_MAIN = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"
TPL_MAIN = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml"
# settings children that must come before <w:embedTrueTypeFonts/> (CT_Settings order)
BEFORE_EMBED = {"writeProtection", "view", "zoom", "removePersonalInformation", "removeDateAndTime",
                "doNotDisplayPageBoundaries", "displayBackgroundShape", "printPostScriptOverText",
                "printFractionalCharacterWidth", "printFormsData"}


def obfuscate(data: bytes, guid: str) -> bytes:
    """ECMA-376 font obfuscation: XOR the first 32 bytes with the GUID bytes in reverse order."""
    hexs = guid.replace("-", "")
    key = [int(hexs[i:i + 2], 16) for i in range(0, 32, 2)][::-1]
    head = bytes(b ^ key[i % 16] for i, b in enumerate(data[:32]))
    return head + data[32:]


def main(src: str, dst: str, dotx: str | None):
    with zipfile.ZipFile(src) as z:
        parts = {n: z.read(n) for n in z.namelist() if not n.endswith("/")}

    font_table = parts["word/fontTable.xml"].decode("utf8")
    rels_name = "word/_rels/fontTable.xml.rels"
    rels = []
    entries = []
    n = 0
    for name, spec in FAMILIES.items():
        # drop any existing entry for this family
        font_table = re.sub(r'<w:font w:name="%s">.*?</w:font>' % re.escape(name), "", font_table, flags=re.S)
        embeds = []
        for slot in SLOT_ORDER:
            fname = spec["files"].get(slot)
            if not fname:
                continue
            n += 1
            guid = str(uuid.uuid4()).upper()
            rid = f"rIdFont{n}"
            parts[f"word/fonts/font{n}.odttf"] = obfuscate((FONTS / fname).read_bytes(), guid)
            rels.append(f'<Relationship Id="{rid}" Type="{REL_FONT}" Target="fonts/font{n}.odttf"/>')
            embeds.append(f'<w:{slot} r:id="{rid}" w:fontKey="{{{guid}}}"/>')
        entries.append(
            f'<w:font w:name="{name}"><w:charset w:val="00"/><w:family w:val="{spec["family"]}"/>'
            f'<w:pitch w:val="variable"/>{"".join(embeds)}</w:font>'
        )

    if 'xmlns:r="' not in font_table:
        font_table = font_table.replace(
            "<w:fonts ", '<w:fonts xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)
    if "</w:fonts>" in font_table:
        font_table = font_table.replace("</w:fonts>", "".join(entries) + "</w:fonts>")
    else:  # self-closing root
        font_table = re.sub(r"<w:fonts([^>]*)/>", lambda m: f"<w:fonts{m.group(1)}>{''.join(entries)}</w:fonts>", font_table)
    parts["word/fontTable.xml"] = font_table.encode("utf8")
    parts[rels_name] = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(rels) + "</Relationships>"
    ).encode("utf8")

    ct = parts["[Content_Types].xml"].decode("utf8")
    if 'Extension="odttf"' not in ct:
        ct = ct.replace("<Default ", '<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/><Default ', 1)
    parts["[Content_Types].xml"] = ct.encode("utf8")

    settings = parts["word/settings.xml"].decode("utf8")
    if "<w:embedTrueTypeFonts" not in settings:
        body_start = settings.index(">", settings.index("<w:settings")) + 1
        pos = body_start
        for m in re.finditer(r"<w:(\w+)\b[^>]*?(/>|>.*?</w:\1>)", settings[body_start:], flags=re.S):
            if m.group(1) in BEFORE_EMBED:
                pos = body_start + m.end()
            else:
                break
        settings = settings[:pos] + "<w:embedTrueTypeFonts/>" + settings[pos:]
    parts["word/settings.xml"] = settings.encode("utf8")

    def write(path: str, template: bool):
        p = dict(parts)
        if template:
            p["[Content_Types].xml"] = p["[Content_Types].xml"].decode("utf8").replace(DOC_MAIN, TPL_MAIN).encode("utf8")
        order = ["[Content_Types].xml"] + [k for k in p if k != "[Content_Types].xml"]
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for k in order:
                z.writestr(k, p[k])
        print("wrote", path, Path(path).stat().st_size // 1024, "KB")

    write(dst, False)
    if dotx:
        write(dotx, True)


if __name__ == "__main__":
    args = sys.argv[1:]
    dotx = None
    if "--dotx" in args:
        i = args.index("--dotx")
        dotx = args[i + 1]
        del args[i:i + 2]
    main(args[0], args[1], dotx)

"""Generate original architectural line/duotone SVG artwork for the Trueworth site.

Each piece is a simple 3D scene (boxes, columns, fins) projected through a pinhole
camera, so the perspective is geometrically correct.  Output: assets/img/art-*.svg
"""
import math, random, sys, os

OUT = sys.argv[1] if len(sys.argv) > 1 else "."

# ---------- palette (derived from the Trueworth teal #0D5E70) ----------
SKY_TOP = "#5C838C"
SKY_BOT = "#C6AC97"
STONE_LIT = "#DCCBB4"
STONE_SHADE = "#B9A48C"
STONE_DARK = "#8F7C68"
GLASS_A = "#2F7E8C"
GLASS_B = "#5FA6B1"
GLASS_DEEP = "#174E5A"
FRAME = "#1B3F48"


def lerp(a, b, t):
    return a + (b - a) * t


def lerp3(p, q, t):
    return tuple(lerp(p[i], q[i], t) for i in range(3))


def hexmix(h1, h2, t):
    a = [int(h1[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(h2[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(lerp(a[i], b[i], t)):02x}" for i in range(3))


class Cam:
    def __init__(self, w, h, f, pitch_deg=0.0, yaw_deg=0.0, cx=None, cy=None):
        self.w, self.h, self.f = w, h, f
        self.p = math.radians(pitch_deg)
        self.yw = math.radians(yaw_deg)
        self.cx = w / 2 if cx is None else cx
        self.cy = h / 2 if cy is None else cy

    def proj(self, P):
        X, Y, Z = P
        # yaw around Y
        X, Z = X * math.cos(self.yw) - Z * math.sin(self.yw), X * math.sin(self.yw) + Z * math.cos(self.yw)
        # pitch (look up)
        y = Y * math.cos(self.p) - Z * math.sin(self.p)
        z = Y * math.sin(self.p) + Z * math.cos(self.p)
        z = max(z, 1e-3)
        return (self.cx + self.f * X / z, self.cy - self.f * y / z)


def poly(pts, fill, extra=""):
    d = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return f'<polygon points="{d}" fill="{fill}"{extra}/>'


def quad(cam, a, b, c, d):
    return [cam.proj(a), cam.proj(b), cam.proj(c), cam.proj(d)]


def face_point(A, B, D, u, v):
    """Point on a planar face spanned by A->B (u) and A->D (v)."""
    return tuple(A[i] + (B[i] - A[i]) * u + (D[i] - A[i]) * v for i in range(3))


def svg_wrap(w, h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">'
            f'<defs>{defs}</defs>{body}</svg>')


def sky_defs(top=SKY_TOP, bot=SKY_BOT, id_="sky"):
    return (f'<linearGradient id="{id_}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>')


def grid_face(cam, A, B, D, cols, rows, base, glass_fn, inset_u=0.18, inset_v=0.14, rng=None):
    """Facade face A(bottom-left) B(bottom-right) D(top-left) with window grid."""
    out = [poly(quad(cam, A, B, face_point(A, B, D, 1, 1), D), base)]
    for r in range(rows):
        for c in range(cols):
            u0, u1 = c / cols + inset_u / cols, (c + 1) / cols - inset_u / cols
            v0, v1 = r / rows + inset_v / rows, (r + 1) / rows - inset_v / rows
            pts = [face_point(A, B, D, u0, v0), face_point(A, B, D, u1, v0),
                   face_point(A, B, D, u1, v1), face_point(A, B, D, u0, v1)]
            out.append(poly([cam.proj(p) for p in pts], glass_fn(c, r, cols, rows)))
    return out


# ---------------------------------------------------------------- tower
def tower(seed=3, w=1800, h=1200, pitch=58, x_off=520, top_tone=0.0):
    rng = random.Random(seed)
    cam = Cam(w, h, f=1050, pitch_deg=pitch, cy=h * 0.5)
    body = [f'<rect width="{w}" height="{h}" fill="url(#sky)"/>']
    # tower: square plan rotated 45deg, nearest corner at (x_off, 0, 60)
    s = 90.0
    H = 420.0
    c = (x_off * 0.12, -40.0, 55.0)  # near corner
    L = (c[0] - s * math.cos(math.radians(40)), c[1], c[2] + s * math.sin(math.radians(40)))
    Rr = (c[0] + s * math.cos(math.radians(50)), c[1], c[2] + s * math.sin(math.radians(50)))
    up = lambda p: (p[0], p[1] + H, p[2])

    def glass(shift):
        def g(cc, r, cols, rows):
            t = r / rows
            base = hexmix(GLASS_A, GLASS_B, min(1, 0.25 + 0.6 * t + rng.uniform(-0.12, 0.12) + shift))
            return base
        return g

    floors, cols = 60, 9
    # left face (shaded)
    body += grid_face(cam, L, c, up(L), cols, floors, STONE_SHADE, glass(-0.1), 0.34, 0.10, rng)
    # right face (lit)
    body += grid_face(cam, c, Rr, up(c), cols, floors, STONE_LIT, glass(0.15), 0.34, 0.10, rng)
    # corner pier highlight
    body.append(poly(quad(cam, (c[0] - 1.2, c[1], c[2]), (c[0] + 1.2, c[1], c[2]),
                          up((c[0] + 1.2, c[1], c[2])), up((c[0] - 1.2, c[1], c[2]))), "#E8DAC6"))
    return svg_wrap(w, h, "".join(body), sky_defs())


# ---------------------------------------------------------------- colonnade
def colonnade(w=1800, h=1200):
    cam = Cam(w, h, f=1000, pitch_deg=22, yaw_deg=-32, cx=w * 0.42, cy=h * 0.70)
    body = [f'<rect width="{w}" height="{h}" fill="url(#sky)"/>']
    floor_y, top_y = -14.0, 34.0
    z = 60.0            # plane of the column centres
    radius = 2.2
    xs = [i * 11.0 for i in range(-8, 30)]
    zb = z + 14         # back wall of the portico
    body.append(poly(quad(cam, (-200, floor_y, zb), (500, floor_y, zb), (500, top_y, zb), (-200, top_y, zb)),
                     hexmix(STONE_DARK, GLASS_DEEP, 0.35)))
    # door openings on the back wall
    for x in xs[::2]:
        x0 = x + 3.0
        body.append(poly(quad(cam, (x0, floor_y, zb - 0.01), (x0 + 5, floor_y, zb - 0.01), (x0 + 5, floor_y + 16, zb - 0.01),
                              (x0, floor_y + 16, zb - 0.01)), hexmix(GLASS_DEEP, FRAME, 0.4)))
    # portico ceiling (underside of the entablature)
    body.append(poly(quad(cam, (-200, top_y, z - 3), (500, top_y, z - 3), (500, top_y, zb), (-200, top_y, zb)),
                     hexmix(STONE_DARK, STONE_SHADE, 0.35)))
    # columns, far to near (the camera is yawed so larger x is farther)
    for x in sorted(xs, key=lambda v: -v):
        n = 16
        for k in range(n):
            a0 = math.pi * k / n
            a1 = math.pi * (k + 1) / n
            p0 = (x - radius * math.cos(a0), z - radius * math.sin(a0))
            p1 = (x - radius * math.cos(a1), z - radius * math.sin(a1))
            light = 0.5 + 0.5 * math.cos((a0 + a1) / 2 - 1.1)
            col = hexmix(STONE_DARK, "#F0E5D5", max(0, min(1, light)))
            body.append(poly(quad(cam, (p0[0], floor_y + 1.2, p0[1]), (p1[0], floor_y + 1.2, p1[1]),
                                  (p1[0], top_y - 1.4, p1[1]), (p0[0], top_y - 1.4, p0[1])), col))
        r2 = radius * 1.45
        # abacus (capital block): underside + front face
        body.append(poly(quad(cam, (x - r2, top_y - 1.4, z - r2), (x + r2, top_y - 1.4, z - r2),
                              (x + r2, top_y - 1.4, z + r2), (x - r2, top_y - 1.4, z + r2)), STONE_DARK))
        body.append(poly(quad(cam, (x - r2, top_y - 1.4, z - r2), (x + r2, top_y - 1.4, z - r2),
                              (x + r2, top_y, z - r2), (x - r2, top_y, z - r2)), STONE_LIT))
        # plinth
        body.append(poly(quad(cam, (x - r2, floor_y, z - r2), (x + r2, floor_y, z - r2),
                              (x + r2, floor_y + 1.2, z - r2), (x - r2, floor_y + 1.2, z - r2)), STONE_LIT))
    # entablature front face with fascia bands
    zf = z - 3
    body.append(poly(quad(cam, (-200, top_y, zf), (500, top_y, zf), (500, top_y + 9, zf), (-200, top_y + 9, zf)), STONE_LIT))
    for yb, col in ((top_y + 2.6, STONE_SHADE), (top_y + 5.2, STONE_SHADE), (top_y + 7.6, "#EDE1CF")):
        body.append(poly(quad(cam, (-200, yb, zf - 0.01), (500, yb, zf - 0.01), (500, yb + 0.35, zf - 0.01),
                              (-200, yb + 0.35, zf - 0.01)), col))
    return svg_wrap(w, h, "".join(body), sky_defs(hexmix(SKY_TOP, "#7FA1A8", 0.3), SKY_BOT))


# ---------------------------------------------------------------- louvres
def louvres(w=1800, h=1200):
    cam = Cam(w, h, f=820, pitch_deg=30, yaw_deg=35, cy=h * 0.55)
    body = [f'<rect width="{w}" height="{h}" fill="url(#sky)"/>']
    # glass curtain wall behind fins
    A, B = (-60, -30, 40), (60, -30, 140)
    D = (-60, 260, 40)
    body.append(poly(quad(cam, A, B, face_point(A, B, D, 1, 1), D), "url(#glass)"))
    # vertical mullions
    for i in range(0, 41):
        u = i / 40
        p0, p1 = face_point(A, B, D, u, 0), face_point(A, B, D, u, 1)
        q0, q1 = face_point(A, B, D, u + 0.002, 0), face_point(A, B, D, u + 0.002, 1)
        body.append(poly([cam.proj(p0), cam.proj(q0), cam.proj(q1), cam.proj(p1)], FRAME, ' opacity="0.55"'))
    # horizontal fins projecting out of the wall
    n = 60
    for j in range(n):
        v = j / n
        p0, p1 = face_point(A, B, D, 0, v), face_point(A, B, D, 1, v)
        # normal of the wall (pointing toward camera)
        nx, nz = -(B[2] - A[2]), (B[0] - A[0])
        ln = math.hypot(nx, nz)
        depth = 5.0
        o = (nx / ln * -depth, 0, nz / ln * -depth)
        p0o = (p0[0] + o[0], p0[1], p0[2] + o[2])
        p1o = (p1[0] + o[0], p1[1], p1[2] + o[2])
        t = j / n
        top = hexmix(STONE_LIT, "#F1E6D6", t * 0.6)
        under = hexmix(STONE_DARK, STONE_SHADE, t)
        thick = 0.7
        body.append(poly([cam.proj(p0), cam.proj(p1), cam.proj(p1o), cam.proj(p0o)], under))
        body.append(poly([cam.proj(p0o), cam.proj(p1o), cam.proj((p1o[0], p1o[1] + thick, p1o[2])),
                          cam.proj((p0o[0], p0o[1] + thick, p0o[2]))], top))
    defs = sky_defs("#4F7A84", SKY_BOT) + (
        f'<linearGradient id="glass" x1="0" y1="1" x2="0.3" y2="0">'
        f'<stop offset="0" stop-color="{GLASS_DEEP}"/><stop offset="0.6" stop-color="{GLASS_A}"/>'
        f'<stop offset="1" stop-color="{GLASS_B}"/></linearGradient>')
    return svg_wrap(w, h, "".join(body), defs)


# ---------------------------------------------------------------- atrium (looking straight up)
def atrium(w=1800, h=1200, seed=7):
    rng = random.Random(seed)
    cam = Cam(w, h, f=700, pitch_deg=90, cy=h / 2)
    body = [f'<rect width="{w}" height="{h}" fill="url(#sky)"/>']
    hw, hd = 40.0, 26.0  # courtyard half sizes
    H = 160.0
    y0 = 6.0
    corners = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
    shades = [STONE_SHADE, STONE_LIT, hexmix(STONE_SHADE, STONE_DARK, 0.4), hexmix(STONE_LIT, STONE_SHADE, 0.4)]

    def glass(cc, r, cols, rows):
        return hexmix(GLASS_DEEP, GLASS_B, min(1, max(0, 0.2 + 0.7 * r / rows + rng.uniform(-0.15, 0.15))))

    for k in range(4):
        x0, z0 = corners[k]
        x1, z1 = corners[(k + 1) % 4]
        # world: camera looks up (+Y). Use Y as depth by mapping (x, y, z)
        A = (x0, y0, z0)
        B = (x1, y0, z1)
        D = (x0, y0 + H, z0)
        cols = 12 if k % 2 == 0 else 8
        body += grid_face(cam, A, B, D, cols, 30, shades[k], glass, 0.22, 0.16)
    return svg_wrap(w, h, "".join(body), sky_defs("#C9B4A1", "#6E949B"))


os.makedirs(OUT, exist_ok=True)
pieces = {
    "art-tower.svg": tower(),
    "art-colonnade.svg": colonnade(),
    "art-louvres.svg": louvres(),
    "art-atrium.svg": atrium(),
}
for name, svg in pieces.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(svg)
    print(name, len(svg) // 1024, "KB")

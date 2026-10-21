"""Render an exact geometric projection as a GIF and a static companion.

Requires Pillow. Labels are prose; mathematical notation belongs in the
accompanying LaTeX text. The fixed camera is an orthographic view of R^3.
"""

from math import cos, hypot, pi, sin, sqrt
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).resolve().parents[1] / "assets"
OUT.mkdir(exist_ok=True)
WIDTH, HEIGHT, AA = 720, 480, 2
PAPER = "#faf9f5"
INK = "#283238"
MUTED = "#6c7376"
PLANE = "#edf0ec"
GRID = "#d4dcd6"
VECTOR = "#3467a0"
PROJECTION = "#18766e"
RESIDUAL = "#a5662e"

# Rows of the camera matrix are orthonormal, so this is a genuine
# orthographic projection rather than a perspective-like distortion.
RIGHT = (sqrt(3) / 2, 0.5, 0)
UP = (-0.25, sqrt(3) / 4, sqrt(3) / 2)
ORIGIN = (216, 324)
SCALE = 92
FOOT = (1, 2, 0)
VECTOR_TIP = (1, 2, 2)


def project(point):
    return (
        ORIGIN[0] + SCALE * sum(a * b for a, b in zip(RIGHT, point)),
        ORIGIN[1] - SCALE * sum(a * b for a, b in zip(UP, point)),
    )


def scaled(point):
    return tuple(round(value * AA) for value in point)


def font(size, serif=False):
    name = "Georgia" if serif else "Arial"
    return ImageFont.truetype(
        f"/System/Library/Fonts/Supplemental/{name}.ttf", size * AA
    )


def line(draw, points, color, width=1):
    draw.line([scaled(point) for point in points], fill=color, width=width * AA)


def dashed(draw, start, end, color, width=1, dash=6):
    dx, dy = end[0] - start[0], end[1] - start[1]
    length = hypot(dx, dy)
    count = max(1, int(length / dash))
    for index in range(0, count, 2):
        a, b = index / count, min((index + 1) / count, 1)
        line(draw, [(start[0] + a * dx, start[1] + a * dy),
                    (start[0] + b * dx, start[1] + b * dy)], color, width)


def arrow(draw, start, end, color, width=3, head=10):
    dx, dy = end[0] - start[0], end[1] - start[1]
    length = hypot(dx, dy)
    if length < 0.01:
        return
    ux, uy = dx / length, dy / length
    line(draw, [start, end], color, width)
    vertices = [end,
                (end[0] - head * ux - head * 0.45 * uy,
                 end[1] - head * uy + head * 0.45 * ux),
                (end[0] - head * ux + head * 0.45 * uy,
                 end[1] - head * uy - head * 0.45 * ux)]
    draw.polygon([scaled(vertex) for vertex in vertices], fill=color)


def label(draw, point, text, color=INK, size=17, anchor="la", serif=False):
    draw.text(scaled(point), text, fill=color, font=font(size, serif), anchor=anchor)


def render(progress):
    image = Image.new("RGB", (WIDTH * AA, HEIGHT * AA), PAPER)
    draw = ImageDraw.Draw(image)
    label(draw, (30, 22), "Orthogonal projection onto a plane", size=24, serif=True)
    stage = ("Resolve the vector into two perpendicular components" if progress == 0
             else "Remove the perpendicular component" if progress < 1
             else "The endpoint reaches its nearest point on the plane")
    label(draw, (30, 58), stage, color=MUTED, size=16)

    corners = [(-0.8, -0.7, 0), (2.8, -0.7, 0),
               (2.8, 3.0, 0), (-0.8, 3.0, 0)]
    polygon = [scaled(project(point)) for point in corners]
    draw.polygon(polygon, fill=PLANE)
    for x in range(3):
        line(draw, [project((x, -0.7, 0)), project((x, 3, 0))], GRID)
    for y in range(3):
        line(draw, [project((-0.8, y, 0)), project((2.8, y, 0))], GRID)
    label(draw, project((1.6, 0.5, 0)), "Target plane", size=16, color=MUTED)

    o, p, v = project((0, 0, 0)), project(FOOT), project(VECTOR_TIP)
    dashed(draw, o, v, MUTED, width=1)
    dashed(draw, p, v, RESIDUAL, width=2)
    arrow(draw, o, p, PROJECTION, width=4)

    # A right-angle marker lies in the plane spanned by FOOT and its normal.
    leg = 0.17
    unit = (1 / sqrt(5), 2 / sqrt(5), 0)
    a = tuple(FOOT[i] - leg * unit[i] for i in range(3))
    b = (a[0], a[1], leg)
    c = (FOOT[0], FOOT[1], leg)
    line(draw, [project(a), project(b), project(c)], RESIDUAL, width=2)

    moving = (FOOT[0], FOOT[1], 2 * (1 - progress))
    tip = project(moving)
    if progress < 1:
        arrow(draw, o, tip, VECTOR, width=3)
    draw.ellipse([scaled((tip[0] - 4, tip[1] - 4)),
                  scaled((tip[0] + 4, tip[1] + 4))], fill=VECTOR)
    draw.ellipse([scaled((o[0] - 3, o[1] - 3)),
                  scaled((o[0] + 3, o[1] + 3))], fill=INK)

    label(draw, (v[0] + 17, v[1] - 10), "Original vector", size=17)
    label(draw, (p[0] + 18, (p[1] + v[1]) / 2 - 8), "Perpendicular residual", color=RESIDUAL, size=16)
    label(draw, (p[0] + 17, p[1] + 9), "Projection", color=PROJECTION, size=17)
    label(draw, (o[0] - 9, o[1] + 14), "Origin", color=MUTED, size=15)
    return image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)


def main():
    # Holds at each end make the decomposition and its endpoint readable.
    values = [0.0] + [0.5 - 0.5 * cos(pi * i / 60) for i in range(1, 61)]
    rgb_frames = [render(value) for value in values]
    palette = rgb_frames[0].quantize(colors=128)
    frames = [frame.quantize(palette=palette, dither=Image.Dither.NONE)
              for frame in rgb_frames]
    durations = [1600] + [70] * 59 + [2000]
    destination = OUT / "orthogonal-projection.gif"
    frames[0].save(destination, save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, disposal=2, optimize=False)
    rgb_frames[0].save(OUT / "orthogonal-projection-still.png")
    rgb_frames[30].save(OUT / "orthogonal-projection-midpoint.png")
    rgb_frames[-1].save(OUT / "orthogonal-projection-endpoint.png")
    with Image.open(destination) as check:
        # Pillow can merge adjacent frames that quantize to the same pixels.
        actual_frames = check.n_frames
        assert actual_frames >= 55
        assert check.size == (WIDTH, HEIGHT)
        total_duration = 0
        for frame_index in range(actual_frames):
            check.seek(frame_index)
            total_duration += check.info["duration"]
        assert total_duration == sum(durations)
    # The retained component is in the plane; the removed component is normal.
    residual = tuple(VECTOR_TIP[i] - FOOT[i] for i in range(3))
    assert sum(FOOT[i] * residual[i] for i in range(3)) == 0
    assert abs(sum(x * y for x, y in zip(RIGHT, UP))) < 1e-12
    print(f"Saved {destination}: {actual_frames} frames, {destination.stat().st_size} bytes")


if __name__ == "__main__":
    main()

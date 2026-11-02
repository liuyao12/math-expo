"""Render the signed-product sweep on [0, pi] with Pillow.

The bitmap uses prose labels only. All mathematical labels are LaTeX in
the reader, overlaid on the animation or placed in its legend.
"""
from math import cos, pi, sin
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / "assets"
W, H, AA = 640, 680, 2
LEFT, RIGHT = 50, 590
BG, GRID, INK = "#f1f2eb", "#d9dfd2", "#52664e"
BLUE, ORANGE, GREEN = "#396fa2", "#b36a35", "#3c7555"


def integral(t):
    return sin(t) ** 2 / 2


def render(t, opacity=1):
    image = Image.new("RGB", (W * AA, H * AA), BG)
    draw = ImageDraw.Draw(image)
    regular = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 24 * AA)
    small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 23 * AA)

    def points(values):
        return [(round(x * AA), round(y * AA)) for x, y in values]

    def line(values, fill, width=2):
        draw.line(points(values), fill=fill, width=width * AA, joint="curve")

    def label(x, y, value, fill=INK, font=regular):
        draw.text((x * AA, y * AA), value, fill=fill, font=font)

    def x(a):
        return LEFT + (RIGHT - LEFT) * a / pi

    def blend(color, amount):
        rgb = tuple(int(color[i:i + 2], 16) for i in (1, 3, 5))
        background = (241, 242, 235)
        return tuple(round(a * amount + b * (1 - amount)) for a, b in zip(rgb, background))

    full = [pi * i / 320 for i in range(321)]
    active = [t * i / 240 for i in range(241)]
    panels = [(130, 72, 1), (340, 115, .5), (580, 160, .5)]
    for baseline, scale, peak in panels:
        line([(LEFT, baseline), (RIGHT, baseline)], GRID, 1)
        line([(LEFT, baseline - scale * peak), (RIGHT, baseline - scale * peak)], "#e4e7dd", 1)
        for a in (0, pi / 2, pi):
            line([(x(a), baseline - scale * peak - 8), (x(a), baseline + (scale * peak if baseline < 500 else 8))], "#e4e7dd", 1)
        if opacity:
            line([(x(t), baseline - scale * peak - 8), (x(t), baseline + (scale * peak if baseline < 500 else 8))], blend("#899482", opacity), 1)

    label(LEFT, 18, "Sine and cosine")
    label(LEFT, 232, "Their signed product")
    label(LEFT, 447, "Integral so far")
    line([(x(a), 130 - 72 * sin(a)) for a in full], BLUE, 3)
    # Dashed cosine matches its orange legend.
    cosine = [(x(a), 130 - 72 * cos(a)) for a in full]
    for i in range(0, 320, 10):
        line(cosine[i:i + 7], ORANGE, 3)

    for positive, color in [(True, BLUE), (False, ORANGE)]:
        curve = [(x(a), 340 - 115 * (max(0, sin(a) * cos(a)) if positive else min(0, sin(a) * cos(a)))) for a in active]
        polygon = [(LEFT, 340), *curve, (x(t), 340)]
        draw.polygon(points(polygon), fill=blend(color, .22 * opacity))
    line([(x(a), 340 - 115 * sin(a) * cos(a)) for a in full], INK, 3)
    line([(x(a), 580 - 160 * integral(a)) for a in full], "#d1dbce", 2)
    if opacity:
        line([(x(a), 580 - 160 * integral(a)) for a in active], blend(GREEN, opacity), 4)
        for y, color in [(130 - 72 * sin(t), BLUE), (130 - 72 * cos(t), ORANGE),
                         (340 - 115 * sin(t) * cos(t), INK), (580 - 160 * integral(t), GREEN)]:
            center = (x(t), y)
            draw.ellipse(points([(center[0] - 5, center[1] - 5), (center[0] + 5, center[1] + 5)]),
                         fill=blend(color, opacity))
    if t >= pi - 1e-10:
        phrase = "Equal areas. The total is zero."
    elif t <= pi / 2:
        phrase = "Positive contributions accumulate."
    else:
        phrase = "Negative contributions cancel them."
    label(LEFT, 633, phrase, font=small)
    return image.resize((W, H), Image.Resampling.LANCZOS)


if __name__ == "__main__":
    assert abs(integral(0)) < 1e-12
    assert abs(integral(pi / 2) - .5) < 1e-12
    assert abs(integral(pi)) < 1e-12
    OUT.mkdir(exist_ok=True)
    frames = [render(0, i / 5) for i in range(6)]
    durations = [60] * 6
    for i in range(1, 85):
        frames.append(render(pi * i / 84))
        durations.append(80)
    durations[-1] = 1200
    for i in range(1, 11):
        frames.append(render(pi, 1 - i / 10))
        durations.append(60)
    still = render(pi)
    still.save(OUT / "function-inner-product-still.png")
    # A shared palette and retained frames keep the static curves inexpensive.
    palette = still.quantize(colors=96, method=Image.Quantize.MEDIANCUT)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    indexed[0].save(OUT / "function-inner-product.gif", save_all=True,
                    append_images=indexed[1:], duration=durations, loop=0,
                    disposal=1, optimize=True)
    print("Rendered the full signed-product sweep and its static companion.")

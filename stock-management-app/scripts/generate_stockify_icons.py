from PIL import Image, ImageDraw

# Common settings
size = 1024
bg_color = '#1E3A8A'
white = '#FFFFFF'
blue = '#14295E'
icon_circle = 680
circle_offset = (size - icon_circle) // 2

# Create app icon with blue background and white circle
icon = Image.new('RGBA', (size, size), bg_color)
draw = ImageDraw.Draw(icon)
draw.ellipse(
    (circle_offset, circle_offset, circle_offset + icon_circle, circle_offset + icon_circle),
    fill=white,
)

# Draw stock cube
cx, cy = size // 2, size // 2
cube_top = 140
cube_side = 240

# Top face
top_face = [
    (cx - cube_side // 2, cy - cube_top // 2),
    (cx, cy - cube_top - cube_side // 4),
    (cx + cube_side // 2, cy - cube_top // 2),
    (cx, cy - cube_top // 4),
]
# Left face
left_face = [
    (cx - cube_side // 2, cy - cube_top // 2),
    (cx, cy - cube_top // 4),
    (cx, cy + cube_side // 2),
    (cx - cube_side // 2, cy + cube_side // 2 - cube_top // 4),
]
# Right face
right_face = [
    (cx, cy - cube_top // 4),
    (cx + cube_side // 2, cy - cube_top // 2),
    (cx + cube_side // 2, cy + cube_side // 2 - cube_top // 4),
    (cx, cy + cube_side // 2),
]

# Draw cube faces
for face in (top_face, left_face, right_face):
    draw.polygon(face, fill=blue)

draw.line([top_face[0], top_face[1], top_face[2], top_face[3], top_face[0]], fill=white, width=24)
draw.line([left_face[0], left_face[1], left_face[2], left_face[3], left_face[0]], fill=white, width=24)
draw.line([right_face[0], right_face[1], right_face[2], right_face[3], right_face[0]], fill=white, width=24)

# Add motion lines
motion_lines = [
    ((cx - 280, cy - 40), (cx - 140, cy - 40)),
    ((cx - 280, cy + 40), (cx - 140, cy + 40)),
]
for line in motion_lines:
    draw.line(line, fill=blue, width=52, joint='curve')

# Save icon and adaptive assets
icon.save('assets/images/icon.png')

foreground = Image.new('RGBA', (size, size), (0, 0, 0, 0))
fg = ImageDraw.Draw(foreground)
fg.ellipse(
    (circle_offset, circle_offset, circle_offset + icon_circle, circle_offset + icon_circle),
    fill=white,
)
for face in (top_face, left_face, right_face):
    fg.polygon(face, fill=blue)
fg.line([top_face[0], top_face[1], top_face[2], top_face[3], top_face[0]], fill=white, width=24)
fg.line([left_face[0], left_face[1], left_face[2], left_face[3], left_face[0]], fill=white, width=24)
fg.line([right_face[0], right_face[1], right_face[2], right_face[3], right_face[0]], fill=white, width=24)
for line in motion_lines:
    fg.line(line, fill=blue, width=52, joint='curve')
foreground.save('assets/images/android-icon-foreground.png')

background = Image.new('RGBA', (size, size), bg_color)
draw_bg = ImageDraw.Draw(background)
draw_bg.rectangle([0, 0, size, size], fill=bg_color)
background.save('assets/images/android-icon-background.png')

monochrome = Image.new('RGBA', (size, size), (0, 0, 0, 0))
mono = ImageDraw.Draw(monochrome)
mono.ellipse(
    (circle_offset, circle_offset, circle_offset + icon_circle, circle_offset + icon_circle),
    fill=white,
)
for face in (top_face, left_face, right_face):
    mono.polygon(face, fill=white)
for line in motion_lines:
    mono.line(line, fill=white, width=52, joint='curve')
monochrome.save('assets/images/android-icon-monochrome.png')

splash = Image.new('RGBA', (size, size), bg_color)
splash_draw = ImageDraw.Draw(splash)
splash_draw.ellipse(
    (circle_offset, circle_offset, circle_offset + icon_circle, circle_offset + icon_circle),
    fill=white,
)
for face in (top_face, left_face, right_face):
    splash_draw.polygon(face, fill=blue)
for line in motion_lines:
    splash_draw.line(line, fill=blue, width=52, joint='curve')
splash.save('assets/images/splash-icon.png')

print('Generated Stockify icon assets.')

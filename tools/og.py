# Ölkə/region paylaşma şəkilləri (1200x630):  python3 tools/og.py
# Şəkil olan ölkələrdə foto fonu, qalanlarında brend gradienti. Mətnə qiymət yazılmır (köhnəlməsin).
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = json.load(open(os.path.join(ROOT, 'data/names.json'), encoding='utf-8'))
W, H = 1200, 630
bold = lambda s: ImageFont.truetype(os.path.join(ROOT, 'tools/fonts/Onest-ExtraBold.ttf'), s)
semi = lambda s: ImageFont.truetype(os.path.join(ROOT, 'tools/fonts/Onest-SemiBold.ttf'), s)
logo = Image.open(os.path.join(ROOT, 'tools/og-logo.png')).convert('RGBA')

def gradient():
    im = Image.new('RGB', (W, H)); px = im.load()
    c0, c1, c2 = (10, 46, 110), (29, 111, 224), (62, 199, 244)
    for y in range(H):
        for x in range(W):
            t = (x / W * .7 + y / H * .5) / 1.2
            if t < .55:
                k = t / .55; c = tuple(int(c0[i] + (c1[i] - c0[i]) * k) for i in range(3))
            else:
                k = min((t - .55) / .45, 1); c = tuple(int(c1[i] + (c2[i] - c1[i]) * k) for i in range(3))
            px[x, y] = c
    return im

def photo_bg(path):
    im = Image.open(path).convert('RGB'); w, h = im.size
    s = max(W / w, H / h); im = im.resize((int(w * s) + 1, int(h * s) + 1), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 3
    im = im.crop((l, t, l + W, t + H))
    ov = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(ov)
    for x in range(W):  # solda tünd, sağa doğru şəffaf
        a = int(215 * max(0, 1 - x / (W * .95)) ** 1.1 + 40)
        d.line([(x, 0), (x, H)], fill=(8, 12, 22, min(a, 235)))
    return Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')

def fit(draw, text, maxw, start):
    size = start
    while size > 40 and draw.textlength(text, font=bold(size)) > maxw: size -= 4
    return bold(size)

GRAD = gradient()
def make(key, label):
    p = os.path.join(ROOT, 'assets/img', f'dest-{key}.webp')
    im = photo_bg(p) if os.path.exists(p) else GRAD.copy()
    d = ImageDraw.Draw(im)
    im.paste(logo, (70, 62), logo)
    line = f'{label} eSIM'
    f = fit(d, line, 1060, 128)
    # uzun adlar (məs. "Bosnia and Herzegovina eSIM") iki sətrə bölünür
    if f.size < 84 and ' ' in label:
        words = line.split(' '); mid = len(words) // 2
        l1, l2 = ' '.join(words[:mid]), ' '.join(words[mid:])
        f = fit(d, max(l1, l2, key=len), 1060, 96)
        d.text((70, 230), l1, font=f, fill='white'); d.text((70, 230 + f.size + 10), l2, font=f, fill='white')
    else:
        d.text((70, 270), line, font=f, fill='white')
    d.text((70, 540), 'Travel data plans  ·  simvela.app', font=semi(34), fill=(226, 238, 255))
    im.save(os.path.join(ROOT, 'assets/og', f'{key}.jpg'), 'JPEG', quality=80, optimize=True, progressive=True)

n = 0
for cc, v in names['countries'].items(): make(cc, v['name']); n += 1
for code, v in names['regions'].items(): make(f'r-{code}', v['name']); n += 1
print('og images', n)

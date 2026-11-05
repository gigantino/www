import sys, json, string, re
sys.path.insert(0, '.')
from parse_board import parse, sample, cell_of, letter_of, C
from collections import defaultdict
items = parse('/tmp/ui/letters/board.svg')
cells = defaultdict(list)
for it in items:
    cells[cell_of(it)].append(it)
BASE, CAP_H = 384, 250
UNIT = CAP_H / 100
STROKE = 32
def fmt(v): return (f"{v:.1f}").rstrip('0').rstrip('.')
def segs_to_d(segs, f):
    return ''.join(cmd + ' '.join(f"{fmt(a)},{fmt(b)}" for a, b in (f(x, y) for x, y in pts)) for cmd, pts in segs)
board_groups, glyphs = [], defaultdict(list)
for (col, row), its in sorted(cells.items(), key=lambda kv: (kv[0][1], kv[0][0])):
    L = letter_of(col, row)
    ox, oy = col * C, row * C
    if not L:
        paths = ''.join(f'<path d="{segs_to_d(it["segs"], lambda x, y: (x, y))}" style="fill:none;stroke:{it["stroke"]};stroke-width:{fmt(it["w"])}px;stroke-linecap:round;stroke-linejoin:round;"/>' for it in its)
        board_groups.append(f'<g>{paths}</g>')
        continue
    pts = [p for it in its for p in sample(it["segs"])]
    minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts)
    miny = min(p[1] for p in pts); maxy = max(p[1] for p in pts)
    w, h = maxx - minx, maxy - miny
    s = max(0.8, min(1.25, CAP_H / h))
    cx = (minx + maxx) / 2
    place = lambda x, y: (ox + 256 + (x - cx) * s, oy + BASE - (maxy - y) * s)
    paths = ''.join(f'<path d="{segs_to_d(it["segs"], place)}" style="fill:none;stroke:{it["stroke"]};stroke-width:{STROKE}px;stroke-linecap:round;stroke-linejoin:round;"/>' for it in its)
    board_groups.append(f'<g id="{L[0]}-{L[1]+1}">{paths}</g>')
    W = w * s
    left = 256 - W / 2
    to_units = lambda x, y: (((place(x, y)[0] - ox) - left) / UNIT + STROKE / UNIT / 2, ((place(x, y)[1] - oy) - (BASE - CAP_H)) / UNIT)
    glyphs[L[0]].append({"advance": round(W / UNIT + STROKE / UNIT, 1), "d": [segs_to_d(it["segs"], to_units) for it in its]})
json.dump({"stroke": round(STROKE / UNIT, 2), "glyphs": glyphs}, open('/tmp/ui/letters/glyphs.json', 'w'))
tmpl = open('/Users/macair/Documents/Doodles/doodle-board-v2.svg').read()
i = tmpl.index('<g id="doodles"')
new = tmpl[:i] + '<g id="doodles">' + ''.join(board_groups) + '</g>\n</svg>\n'
open('/Users/macair/Documents/Doodles/doodle-board-v3.svg', 'w').write(new)
print(len(board_groups), 'groups;', sum(len(v) for v in glyphs.values()), 'glyphs; stroke units', round(STROKE/UNIT,2))
print('total d chars', sum(len(d) for v in glyphs.values() for g in v for d in g['d']))

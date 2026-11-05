import re, sys, json, string
C = 512
def parse(src):
    s = open(src).read()
    body = s[s.index('id="doodles"'):]
    items = []
    stack = [(1,0,0,1,0,0)]
    for tok in re.finditer(r'<g([^>]*)>|</g>|<path d="([^"]+)" style="([^"]+)"', body):
        t = tok.group(0)
        if t.startswith('</g'):
            if len(stack) > 1: stack.pop()
            else: break
        elif t.startswith('<g'):
            m = stack[-1]
            mm = re.search(r'matrix\(([^)]+)\)', tok.group(1) or '')
            if mm:
                a,b,c,d,e,f = map(float, mm.group(1).split(','))
                A,B,Cc,D,E,F = m
                m = (A*a+Cc*b, B*a+D*b, A*c+Cc*d, B*c+D*d, A*e+Cc*f+E, B*e+D*f+F)
            stack.append(m)
        else:
            a,b,c,d,e,f = stack[-1]
            segs = []
            for cmd, args in re.findall(r'([MLC])([^MLC]*)', tok.group(2)):
                n = list(map(float, re.findall(r'-?\d*\.?\d+(?:e-?\d+)?', args)))
                segs.append([cmd, [[a*n[k]+c*n[k+1]+e, b*n[k]+d*n[k+1]+f] for k in range(0, len(n), 2)]])
            style = tok.group(3)
            w = float(re.search(r'stroke-width:([\d.]+)', style).group(1)) * (a*a+b*b) ** 0.5
            col = re.search(r'stroke:([^;]+)', style)
            items.append({"segs": segs, "w": w, "stroke": col.group(1) if col else "rgb(25,0,193)"})
    return items
def sample(segs):
    pts = []; cur = None
    for cmd, p in segs:
        if cmd == 'C':
            for k in range(0, len(p), 3):
                c1, c2, en = p[k], p[k+1], p[k+2]
                for q in range(21):
                    t = q/20; u = 1-t
                    pts.append((u**3*cur[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t**3*en[0], u**3*cur[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t**3*en[1]))
                cur = en
        else:
            for pt in p: pts.append(tuple(pt)); cur = pt
    return pts
def cell_of(item):
    pts = sample(item["segs"])
    mx = sum(p[0] for p in pts)/len(pts); my = sum(p[1] for p in pts)/len(pts)
    return int(mx // C), int(my // C)
def letter_of(col, row):
    if row < 4: return None
    k = (row - 4) * 2 + col // 3
    if k >= 26: return None
    return string.ascii_uppercase[k], col % 3

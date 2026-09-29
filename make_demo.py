#!/usr/bin/env python3
"""
Build demo/index.html: the real SukiRun app, cut off from every server, filled with an
invented company.

    python make_demo.py [path/to/sukirun.built.html]

It takes the app exactly as built for release and changes four things:

  1. the server address, its key and the update address are blanked -- with no server the
     app skips login, opens every role, and keeps every save in the browser
  2. the distributor's name becomes "Demo Distribution Co." and its mark is hidden
  3. demo-src/seed.js runs before the app, loading the invented shops and orders once
  4. a strip along the bottom says it is a demo, with a Reset button

It REFUSES to write the file if the server address survives anywhere in it.
"""
import io, json, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else r'D:\Order Run\sukirun.built.html'
PRODUCTS = r'D:\Order Run\products.json'
SERVER_REF = 'ycjaxvxhcywhnqqbgsml'

html = io.open(SRC, encoding='utf-8').read()
m = re.search(r'"versionName":\s*"([^"]+)",\s*"versionCode":\s*(\d+)', html)
if not m:
    raise SystemExit('could not find the build block in ' + SRC)
version, code = m.group(1), int(m.group(2))

# 1. no server, no update checks
for key in ('supabaseUrl', 'supabaseKey', 'updateUrl'):
    html, k = re.subn(r'"%s":\s*"[^"]*"' % key, '"%s": ""' % key, html)
    if k != 1:
        raise SystemExit('expected exactly one "%s" in the build, found %d' % (key, k))
if SERVER_REF in html or 'sb_publishable_' in html:
    raise SystemExit('the server address is still in the demo -- refusing to write it')

# 2. the neutral company
html, k = re.subn(r"const COMPANY = '[^']*';", "const COMPANY = 'Demo Distribution Co.';", html)
if k != 1:
    raise SystemExit('COMPANY not found')
html = html.replace('<title>Suki \u2014 Store Orders</title>', '<title>SukiRun demo \u2014 Demo Distribution Co.</title>')

# 2b. no product without a picture. The list that ships inside the app still carries two
#     the office deleted on the server long ago (Season's Burger and Mayo Dressing 1L);
#     the real app drops them when it syncs, but the demo never syncs. Same rule for both
#     copies of the list: the app's built-in one and the seed's.
m = re.search(r'const DEFAULT_PRODUCTS = ', html)
if not m:
    raise SystemExit('DEFAULT_PRODUCTS not found')
builtin, end = json.JSONDecoder().raw_decode(html, m.end())
kept = [p for p in builtin if p.get('img')]
html = html[:m.end()] + json.dumps(kept, ensure_ascii=False) + html[end:]
gone = sorted({p['name'] for p in builtin if not p.get('img')})

# 3 + 4. the seed, and the strip
products = [p for p in json.load(io.open(PRODUCTS, encoding='utf-8')) if p.get('img')]
slim = [{'id': p['id'], 'name': p['name'], 'price': p.get('price', 0), 'unit': p.get('unit', ''),
         'img': bool(p.get('img'))} for p in products]
seed = io.open(os.path.join(ROOT, 'demo-src', 'seed.js'), encoding='utf-8').read()
# '+catalog2': a browser that opened the demo before this fix gets the invented data again,
# without the two dead products
seed = (seed.replace('__DEMO_PRODUCTS__', json.dumps(slim, ensure_ascii=False))
            .replace('__DEMO_VERSION__', version + '+catalog2').replace('__DEMO_BUILD__', str(code)))
strip = '''<style>
  .home-mark{display:none !important}
  #demo-strip{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;gap:10px;align-items:center;
    justify-content:center;flex-wrap:wrap;padding:7px 12px calc(7px + env(safe-area-inset-bottom));
    background:rgba(20,16,30,.94);border-top:1px solid rgba(255,255,255,.14);color:#e8e6f0;
    font:600 12.5px/1.3 Inter,system-ui,sans-serif;backdrop-filter:blur(8px)}
  #demo-strip b{color:#F2578C}
  #demo-strip button{font:inherit;padding:5px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.28);
    background:transparent;color:inherit;cursor:pointer}
  #demo-strip a{color:#F7C23A}
  body{padding-bottom:46px}
</style>
<script>%s</script>
''' % seed
bar = '''<div id="demo-strip"><span><b>Demo</b> \u00b7 an invented company \u00b7 nothing leaves this browser</span>
  <button type="button" onclick="sukiDemoReset()">\u21bb Reset demo</button>
  <a href="../">\u2190 Back to the presentation</a></div>
</body>'''
if html.count('<head>') != 1 or html.count('</body>') != 1:
    raise SystemExit('unexpected page shape')
html = html.replace('<head>', '<head>\n' + strip, 1)
html = html.replace('</body>', bar, 1)

os.makedirs(os.path.join(ROOT, 'demo'), exist_ok=True)
out = os.path.join(ROOT, 'demo', 'index.html')
io.open(out, 'w', encoding='utf-8', newline='\n').write(html)
print('wrote demo/index.html  (SukiRun %s, build %d, %.1f MB, no server)' % (version, code, len(html.encode('utf-8')) / 1048576))

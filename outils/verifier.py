"""Vérifie Aalam dans un vrai navigateur, puis régénère notifs.json.
   python3 outils/verifier.py            vérifications + notifs.json
   python3 outils/verifier.py "Titre"…   vérifie aussi en détail le format complet des fiches nommées (nouveau lot)
Besoin : playwright (pip) et chromium (playwright install chromium)."""
import json, os, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D3 = "/opt/npm-tools/node_modules/d3/dist/d3.min.js"
NEW = sys.argv[1:]
PORT = 8765

CHECK = """async (NEW) => {
  await AD.moreAll();
  const titles = new Map(), dups = [], items = [], probs = [];
  SECTIONS.forEach(s => (s.groups||[]).forEach(g => (g.notions||[]).forEach(n => { if (titles.has(n.t)) dups.push(n.t); titles.set(n.t, s.id); items.push({s:s.id, g:g.title, n}); })));
  const cids = new Set(CONFLICTS.map(c => c.id)), cnames = new Set(CONFLICTS.map(c => c.name)), key = t => t.startsWith("c:") ? cids.has(t.slice(2)) : titles.has(t) || cnames.has(t);
  const warns = [];
  items.forEach(({s, n}) => {
    (n.see||[]).forEach(t => { if (!key(t)) probs.push(["voir aussi", n.t, t]); });
    (n.places||n.p||[]).forEach(c => { if (!COUNTRY[c]) (NEW.includes(n.t) ? probs : warns).push(["pays absent du globe", n.t, c]); });
    if (MORE[n.t] && MORE[n.t].stub) probs.push(["article non chargé", n.t]);
  });
  NEW.forEach(t => {
    const it = items.find(x => x.n.t === t); if (!it) return probs.push(["fiche absente", t]);
    const n = it.n;
    if (!n.q || n.q.length !== 4 || n.q.some(q => q.length !== 5 || new Set(q.slice(1)).size !== 4)) probs.push(["quiz", t]);
    if (!CHAIN[t] || CHAIN[t].length !== 4) probs.push(["chaîne", t]);
    if (!NEW_HOOKS[t] && !hookOf(t)) probs.push(["accroche", t]);
    const m = MORE[t]; if (!m || !m.keys || !m.parts || m.parts.length < 2 || !m.debates || !m.read) probs.push(["en savoir plus", t]);
    if (it.s === "histoire" && (!n.y || !n.d)) probs.push(["frise", t]);
    ["intro","ex","why"].forEach(k => { if (!n[k] || n[k].length < 40) probs.push(["champ court", t, k]); });
  });
  PATHS.forEach(p => p.steps.forEach(st => { if (!key(st)) probs.push(["parcours", p.id, st]); }));
  const pid = PATHS.map(x => x.id); pid.forEach((x, i) => { if (pid.indexOf(x) !== i) probs.push(["parcours en double", x]); });
  Object.keys(DESSOUS).forEach(k => { if (!key(k)) probs.push(["dessous orphelin", k]); });
  const notifs = [];
  items.forEach(({s, n}) => { if (n.ready !== false && hookOf(n.t)) notifs.push([n.t, s, hookOf(n.t)]); });
  CONFLICTS.forEach(c => { if (hookOf("c:" + c.id)) notifs.push(["c:" + c.id, "geo", hookOf("c:" + c.id)]); });
  return {fiches: titles.size, parcours: PATHS.length, dessous: Object.keys(DESSOUS).length, articles: Object.keys(MORE).length, dups, probs, warns, notifs};
}"""

srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "-d", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 390, "height": 844}, service_workers="block")
        pg = ctx.new_page(); errs = []
        if os.path.exists(D3): pg.route("**/d3.min.js", lambda r: r.fulfill(path=D3, content_type="application/javascript"))
        pg.route("**/fonts.googleapis.com/**", lambda r: r.fulfill(body="", content_type="text/css"))
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://127.0.0.1:{PORT}/index.html"); pg.wait_for_timeout(2500)
        r = pg.evaluate(CHECK, NEW)
        b.close()
finally:
    srv.terminate()

notifs = r.pop("notifs")
warns = r.pop("warns")
print(json.dumps({k: v for k, v in r.items() if k != "probs"}, ensure_ascii=False), "·", len(warns), "petits pays absents du globe (sans gravité)")
for x in r["probs"]: print("PROBLÈME", *x)
for e in errs: print("ERREUR JS", e)
if r["probs"] or r["dups"] or errs: sys.exit(1)
with open(os.path.join(ROOT, "notifs.json"), "w", encoding="utf-8") as f: json.dump(notifs, f, ensure_ascii=False, separators=(",", ":"))
print("notifs.json :", len(notifs), "messages")

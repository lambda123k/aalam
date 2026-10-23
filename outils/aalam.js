#!/usr/bin/env node
/* Outils de contenu d'Aalam (étape 8 du programme).
   L'appli est découpée ainsi :
     index.html               le code, plus le petit chargeur AD
     data/<section>.js        le contenu chargé au démarrage (fiches, quiz, chaînes, accroches…), un fichier par section
     data/more/<section>.json les articles « En savoir plus », chargés seulement quand on les ouvre
     data/articles.js         la liste des articles (section, minutes de lecture), pour afficher les boutons sans charger le texte
   Chaque fichier est appelé avec ?v=<empreinte> : après une mise à jour, le téléphone ne retélécharge que les fichiers modifiés.

   Commandes :
     node outils/aalam.js lot <fichier.js>   ajoute un lot écrit comme avant (NEWF.push({...}), Object.assign(DESSOUS, {...}), PATHS.push(...))
                                              les fiches vont dans data/<sid>.js, leur « more » dans data/more/<sid>.json,
                                              le reste (dessous, parcours) dans data/commun.js
     node outils/aalam.js versions           recalcule les empreintes après une modification à la main d'un fichier de data/
*/
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const acorn = require("./vendor/acorn.js");
const ROOT = path.resolve(__dirname, "..");
const D = p => path.join(ROOT, "data", p);
const hash = s => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const readMin = (...t) => Math.max(1, Math.round(t.join(" ").split(/\s+/).length / 190));

function versions(){
  // 1) liste des articles et empreintes des fichiers d'articles
  const meta = {}, mv = {};
  for (const f of fs.readdirSync(D("more")).filter(f => f.endsWith(".json")).sort()){
    const sec = f.slice(0, -5), body = fs.readFileSync(D("more/" + f), "utf8"), d = JSON.parse(body);
    mv[sec] = hash(body);
    meta[sec] = Object.fromEntries(Object.entries(d).map(([k, m]) => [k, [readMin(...(m.parts || []).map(p => p.p), ...(m.debates || []).map(x => x.t)), m.debates && m.debates.length ? 1 : 0]]));
  }
  fs.writeFileSync(D("articles.js"), "/* Aalam — liste des articles « En savoir plus » : section, minutes de lecture, débats (généré par outils/aalam.js) */\nAD.meta(" + JSON.stringify(meta) + ", " + JSON.stringify(mv) + ");\n");
  // 2) balises <script> de index.html, dans l'ordre existant ; une nouvelle section s'ajoute avant articles.js
  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const files = fs.readdirSync(path.join(ROOT, "data")).filter(f => f.endsWith(".js"));
  for (const f of files){
    const tag = '<script src="data/' + f + "?v=" + hash(fs.readFileSync(D(f), "utf8")) + '"></script>';
    const re = new RegExp('<script src="data/' + f.replace(/\./g, "\\.") + '\\?v=[0-9a-f]+"></script>');
    if (re.test(html)) html = html.replace(re, tag);
    else html = html.replace(/<script src="data\/articles\.js\?v=[0-9a-f]+"><\/script>/, m => tag + "\n" + m);
  }
  fs.writeFileSync(path.join(ROOT, "index.html"), html);
  console.log("empreintes à jour :", files.length, "fichiers de démarrage,", Object.keys(mv).length, "fichiers d'articles");
}

function lot(file){
  const src = fs.readFileSync(file, "utf8");
  const ast = acorn.parse(src, {ecmaVersion: "latest"});
  const val = n => Function('"use strict"; return (' + src.slice(n.start, n.end) + ")")();
  const bySec = {}, more = {}, extras = [];
  let n = 0;
  for (const s of ast.body){
    const e = s.type === "ExpressionStatement" ? s.expression : null;
    if (e && e.type === "CallExpression" && e.callee.type === "MemberExpression" && e.callee.object.name === "NEWF" && e.callee.property.name === "push"){
      for (const a of e.arguments){
        const o = val(a);
        if (!o.sid || !o.t) throw new Error("fiche sans sid ou sans titre");
        if (o.more){ (more[o.sid] ||= {})[o.t] = o.more; delete o.more; }
        (bySec[o.sid] ||= []).push(o); n++;
      }
    } else if (s.type !== "EmptyStatement") extras.push(src.slice(s.start, s.end));
  }
  for (const [sec, list] of Object.entries(bySec)){
    const f = D(sec + ".js");
    const head = fs.existsSync(f) ? "" : "/* Aalam — contenu chargé au démarrage : " + sec + " */\n";
    fs.appendFileSync(f, head + "\n/* " + path.basename(file) + " */\nAD.later(\"fiches\", () => NEWF.push(\n" + list.map(o => JSON.stringify(o)).join(",\n") + "\n));\n");
  }
  for (const [sec, m] of Object.entries(more)){
    const f = D("more/" + sec + ".json"), d = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
    Object.assign(d, m); fs.writeFileSync(f, JSON.stringify(d));
  }
  if (extras.length) fs.appendFileSync(D("commun.js"), "\n/* " + path.basename(file) + " : volets « Les dessous », parcours… */\nAD.later(\"extras\", () => {\n" + extras.join("\n") + "\n});\n");
  console.log(n, "fiches ajoutées dans", Object.keys(bySec).join(", ") || "-", "·", Object.values(more).reduce((s, m) => s + Object.keys(m).length, 0), "articles ·", extras.length, "autres blocs");
  versions();
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "lot" && arg) lot(arg);
else if (cmd === "versions") versions();
else { console.log("usage : node outils/aalam.js lot <fichier.js> | versions"); process.exit(1); }

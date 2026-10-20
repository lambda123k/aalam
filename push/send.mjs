// Envoie les rappels d'Aalam via OneSignal. Lancé chaque jour par GitHub Actions.
//   node push/send.mjs jour   → la fiche du jour, à l'heure choisie par chacun (matin, midi ou soir)
//   node push/send.mjs serie  → « ta série t'attend », seulement à ceux qui n'ont pas encore fait leur objectif
import { readFileSync } from "node:fs";

const APP_URL = "https://lambda123k.github.io/aalam/";
const cfg = JSON.parse(readFileSync(new URL("./config.json", import.meta.url)));
const KEY = process.env.ONESIGNAL_API_KEY;
const mode = process.argv[2] || "jour";

if (!cfg.appId || !KEY){ console.log("OneSignal pas encore configuré : rien à envoyer."); process.exit(0); }

// date du jour à Paris, au format AAAAMMJJ
const paris = new Intl.DateTimeFormat("fr-CA", {timeZone:"Europe/Paris", year:"numeric", month:"2-digit", day:"2-digit"}).format(new Date());
const today = paris.replaceAll("-", "");
const dayIndex = Math.floor(Date.UTC(+paris.slice(0, 4), +paris.slice(5, 7) - 1, +paris.slice(8, 10)) / 864e5);

async function send(body){
  const r = await fetch("https://api.onesignal.com/notifications", {
    method:"POST",
    headers:{"Content-Type":"application/json", Authorization:"Key " + KEY},
    body:JSON.stringify({app_id:cfg.appId, target_channel:"push", ...body})
  });
  const t = await r.text();
  console.log(r.status, t);
  if (!r.ok) process.exitCode = 1;
}

if (mode === "jour"){
  const fiches = JSON.parse(readFileSync(new URL("./fiches.json", import.meta.url)));
  const f = fiches[dayIndex % fiches.length];
  const url = APP_URL + "?f=" + encodeURIComponent(f.k) + "&src=push";
  for (const [slot, at] of [["matin", "8:00"], ["midi", "12:30"], ["soir", "19:00"]]){
    await send({
      filters:[{field:"tag", key:"slot", relation:"=", value:slot}],
      headings:{en:"La fiche du jour", fr:"La fiche du jour"},
      contents:{en:f.q, fr:f.q},
      url, delayed_option:"timezone", delivery_time_of_day:at, throttle_rate_per_minute:0
    });
  }
} else if (mode === "serie"){
  await send({
    filters:[
      {field:"tag", key:"serie", relation:"=", value:"1"},
      {field:"tag", key:"streak", relation:">", value:"1"},
      {field:"tag", key:"last_goal", relation:"!=", value:today}
    ],
    headings:{en:"Ta série t'attend", fr:"Ta série t'attend"},
    contents:{en:"Une fiche suffit pour garder ta flamme allumée aujourd'hui.", fr:"Une fiche suffit pour garder ta flamme allumée aujourd'hui."},
    url:APP_URL + "?src=serie"
  });
}

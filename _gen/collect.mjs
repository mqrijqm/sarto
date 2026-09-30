// Kupi slike iz ~/.codex/generated_images i daje im imena iz batch listi.
// Mapiranje: n-ti imagegen poziv u sesiji = n-ta linija batch-a; proverava se preklapanje reči.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const home = os.homedir();
const dir = path.join(home, ".codex/sessions/2026/09/30");
const out = path.resolve("out");
const since = process.argv[2] || "12-10";
const files = fs.readdirSync(dir).filter((f) => f.slice(20, 25) >= since);

const words = (s) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) || []);
for (const f of files) {
  const L = fs.readFileSync(path.join(dir, f), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  let userText = "";
  const calls = [];
  for (const l of L) {
    const p = l.payload || {};
    if (!userText && p.type === "item_completed" && p.item?.type === "UserMessage") userText = p.item.content?.[0]?.text || "";
    if (p.type === "function_call" && p.name === "imagegen") {
      let a = {};
      try { a = JSON.parse(p.arguments); } catch {}
      calls.push({ id: p.call_id, prompt: a.prompt || "" });
    }
  }
  const lines = userText.split("\n").filter((x) => /^[\w-]+\.png \|/.test(x));
  if (!lines.length) continue;
  const thread = f.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\.jsonl$/)[1];
  console.log(`\n# ${f.slice(20, 28)} lines=${lines.length} calls=${calls.length}`);
  calls.forEach((c, i) => {
    // najbolja linija po preklapanju reči (tie -> po redosledu)
    const w = words(c.prompt);
    let best = i, bestScore = -1;
    lines.forEach((ln, j) => {
      const lw = words(ln.split("|")[2] || "");
      let s = 0;
      lw.forEach((x) => w.has(x) && s++);
      s = s / Math.max(1, lw.size) + (j === i ? 0.05 : 0);
      if (s > bestScore) { bestScore = s; best = j; }
    });
    const name = lines[best].split("|")[0].trim();
    const src = path.join(home, ".codex/generated_images", thread, `${c.id}.png`);
    const ok = fs.existsSync(src);
    const dst = path.join(out, name);
    if (ok) fs.copyFileSync(src, dst);
    console.log(`${ok ? "OK " : "MISSING"} ${String(i).padStart(2)} -> ${name} (score ${bestScore.toFixed(2)}, line ${best})`);
  });
}

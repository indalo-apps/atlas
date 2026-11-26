// Saca una versión nueva cambiando los tres sitios a la vez y reconstruye index.html:
//   node herramientas/version.js 5.0.1 "🛠️ Arreglado tal cosa" "✨ Nuevo tal otra"
// 1) <meta name="app-version"> en src/plantilla.html   2) CACHE en sw.js   3) una entrada al principio de NOVEDADES (src/js/ajustes.js)
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const raiz = path.join(__dirname, "..");
const [, , ver, ...nov] = process.argv;
if (!/^\d+(\.\d+){1,2}$/.test(ver || "") || !nov.length) {
  console.error('Uso: node herramientas/version.js <versión> "novedad 1" ["novedad 2" …]'); process.exit(1);
}
const cambiar = (rel, re, por) => {
  const f = path.join(raiz, rel), t = fs.readFileSync(f, "utf8");
  if (!re.test(t)) { console.error("No encuentro dónde cambiar la versión en " + rel); process.exit(1); }
  fs.writeFileSync(f, t.replace(re, por));
};
const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, "");
cambiar("src/plantilla.html", /<meta name="app-version" content="[^"]*">/, `<meta name="app-version" content="${ver}">`);
cambiar("sw.js", /const CACHE = "atlas-v[^"]*";/, `const CACHE = "atlas-v${ver}-${hoy}";`);
const entrada = `    [${JSON.stringify(ver)}, [${nov.map(n => JSON.stringify(n)).join(",\n             ")}]],\n`;
cambiar("src/js/ajustes.js", /(const NOVEDADES = \[\n)/, "$1" + entrada);
execFileSync("node", [path.join(__dirname, "construir.js")], { stdio: "inherit" });
console.log("Versión " + ver + " lista. Antes de publicar: pruebas/partidas.py y pruebas/actualizacion.py.");

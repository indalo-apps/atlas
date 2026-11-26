// Junta las piezas de src/ en index.html (la app que se publica es siempre ese archivo).
//   node herramientas/construir.js         → escribe index.html
//   node herramientas/construir.js --ver   → solo comprueba que index.html está al día (sale con error si no)
// En src/plantilla.html, una línea «@incluir <ruta>» (sola, o dentro de /* */, // o <!-- -->) se cambia por el archivo src/<ruta>.
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, ".."), src = path.join(raiz, "src");
const MARCA = /^[ \t]*(?:\/\*|\/\/|<!--)?[ \t]*@incluir[ \t]+(\S+?)[ \t]*(?:\*\/|-->)?[ \t]*$/;
function montar(archivo, pila = []) {
  if (pila.includes(archivo)) throw new Error("Inclusión circular: " + pila.concat(archivo).join(" → "));
  const texto = fs.readFileSync(path.join(src, archivo), "utf8");
  return texto.split(/(?<=\n)/).map(linea => {
    const m = linea.replace(/\r?\n$/, "").match(MARCA);
    if (!m) return linea;
    const dentro = montar(m[1], pila.concat(archivo));
    return dentro.endsWith("\n") ? dentro : dentro + "\n";
  }).join("");
}
const nuevo = montar("plantilla.html"), destino = path.join(raiz, "index.html");
if (process.argv.includes("--ver")) {
  const actual = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8") : "";
  if (actual !== nuevo) { console.error("index.html NO está al día: ejecuta node herramientas/construir.js"); process.exit(1); }
  console.log("index.html al día (" + nuevo.length + " caracteres)");
} else { fs.writeFileSync(destino, nuevo); console.log("index.html construido (" + nuevo.length + " caracteres)"); }

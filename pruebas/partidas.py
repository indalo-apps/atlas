# Prueba automática del Atlas: juega partidas en los 7 mapas y en todos los modos (aciertos, fallos, «Ver respuesta»),
# arranca cada zona en cada modo y abre Explorar en todos los países y provincias. Necesita Playwright y un servidor local:
#   python3 -m http.server 8765   (en la carpeta de la app)   y luego   python3 pruebas/partidas.py   → «TOTAL ERRORES: 0»
import asyncio, json, sys
from playwright.async_api import async_playwright
MAPAS=["provincias","comunidades","europa","america","asia","africa","oceania"]
JS=r"""
async () => {
  const out = {errores: [], partidas: {}, zonas: {}, explorar: 0, imgs: []};
  const flush = () => { pending.forEach(clearTimeout); pending.length = 0; };
  const modos = [...document.querySelectorAll('.modes button[data-mode]')].filter(b => !b.hidden).map(b => b.dataset.mode).filter(m => m !== 'explore');
  for (const m of modos) {
    try {
      S.mode = m; pressMode(m); newGame(); flush();
      if (m === 'time') { empezarReloj(); flush(); } // sin esperar la cuenta atrás
      let n = 0, guard = 0;
      while (S.cur && !$('#endcard').hidden === false && guard++ < 400) {
        if (!$('#endcard').hidden) break;
        const cur = S.cur;
        // comprobaciones de la pregunta
        if (!P[cur]) out.errores.push(m + ': pregunta sin datos ' + cur);
        if (m === 'cap' && $('#target').textContent !== P[cur][2]) out.errores.push(m + ': capital no coincide ' + cur);
        if (m === 'flag' && !/banderas\//.test($('#flagImg').getAttribute('src'))) out.errores.push(m + ': sin bandera ' + cur);
        if (['name','shape','flag'].includes(m)) {
          const bs = [...document.querySelectorAll('#options .opt')];
          if (bs.length !== 4) out.errores.push(m + ': ' + bs.length + ' opciones en ' + cur);
          if (!bs.some(b => b.dataset.id === cur)) out.errores.push(m + ': falta la buena en ' + cur);
          const ids = bs.map(b => b.textContent); if (new Set(ids).size !== ids.length) out.errores.push(m + ': opciones repetidas ' + ids.join('/'));
        }
        const opt = id => document.querySelector('#options .opt[data-id="' + id + '"]');
        const otro = S.pool.find(x => x !== cur) || ALL.find(x => x !== cur);
        if (m === 'duel') { answerDuel(n % 3 ? cur : otro); }
        else if (m === 'time') { answerTimed(n % 4 ? cur : otro); if (n > 25) { finish(); flush(); break; } }
        else if (n % 5 === 1) { const b = document.querySelector('#options .opt:not([data-id="' + cur + '"])'); answer(b ? b.dataset.id : otro, b); flush(); answer(cur, opt(cur)); }
        else if (n % 7 === 3) { reveal(); }
        else answer(cur, opt(cur));
        flush(); if (S.cur === cur && !$('#endcard').hidden === false && !S.locked && m !== 'time') { /* fallo que sigue */ }
        if ($('#endcard').hidden) next();
        flush(); n++;
      }
      out.partidas[m] = [n, $('#endcard').hidden ? 'sin terminar' : 'terminada'];
      if (!$('#endcard').hidden && m === 'find') { try { const blob = await makeShareImage(); out.share = blob ? blob.size : 'null'; } catch (e) { out.errores.push('compartir: ' + e.message); } }
    } catch (e) { out.errores.push(m + ': EXCEPCIÓN ' + e.message + ' ' + (e.stack||'').split('\n')[1]); }
  }
  // zonas: cada zona en cada modo arranca con preguntas
  for (const [z] of REGIONS) for (const m of modos) {
    try { S.region = z; S.mode = m; pressMode(m); newGame(); flush(); if (!S.cur && !S.total) out.errores.push('zona ' + z + ' / ' + m + ' sin preguntas'); out.zonas[z] = S.total; }
    catch (e) { out.errores.push('zona ' + z + ' / ' + m + ': ' + e.message); }
  }
  S.region = 'all';
  // explorar todos
  S.mode = 'explore'; pressMode('explore'); newGame();
  for (const id of ALL) { try { showInfo(id); out.explorar++; const f = $('#i-flag'); if (!f.hidden) out.imgs.push(f.getAttribute('src')); if (!$('#i-cap').textContent) out.errores.push('explorar sin capital ' + id); } catch (e) { out.errores.push('explorar ' + id + ': ' + e.message); } }
  // las imágenes existen
  const malas = []; for (const u of [...new Set(out.imgs)]) { const r = await fetch(u); if (!r.ok) malas.push(u); }
  if (malas.length) out.errores.push('imágenes que faltan: ' + malas.join(', '));
  out.imgs = out.imgs.length;
  // Ajustes y novedades se abren
  try { document.querySelector('[id*=ajustes], #settings, .footbtn, #ajBtn')?.click(); } catch (e) {}
  return out;
}
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        total = 0
        for vp in [{"width":1280,"height":800},{"width":390,"height":844}]:
            for m in MAPAS:
                pg = await b.new_page(viewport=vp); errs = []
                pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
                pg.on("console", lambda c: c.type == "error" and errs.append("console: " + c.text))
                await pg.goto(f"http://localhost:8765/?mapa={m}"); await pg.wait_for_timeout(1500)
                await pg.wait_for_timeout(800)  # quien entra por primera vez no debe ver «¡La app se ha actualizado!»
                if await pg.evaluate("()=>!!document.getElementById('ik-sheet')"): errs.append("al entrar por primera vez sale una ventana (novedades)")
                r = await pg.evaluate(JS)
                e = r["errores"] + errs
                total += len(e)
                if vp["width"] == 1280 or e:
                    print(f"[{vp['width']}] {m}: partidas={r['partidas']} zonas={len(r['zonas'])} explorar={r['explorar']} imgs={r['imgs']} share={r.get('share')}")
                for x in e[:15]: print("   ✗", x)
                await pg.close()
        print("TOTAL ERRORES:", total)
        await b.close()
        return total
sys.exit(1 if asyncio.run(main()) else 0)

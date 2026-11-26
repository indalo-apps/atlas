# Prueba automática: una versión nueva publicada no debe cortar ni una partida ni su pantalla de resultados.
# Finge que hay una versión 99 publicada, juega una partida corta hasta el final y espera: los resultados deben seguir
# en pantalla. Al pulsar «Jugar otra vez», la app sí debe recargarse para estrenar la versión nueva.
# Uso: python3 -m http.server 8765 (en la carpeta de la app) y luego python3 pruebas/actualizacion.py
import asyncio, re
from playwright.async_api import async_playwright
async def main():
    fallos = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 390, "height": 844})
        cargas = []
        pg.on("framenavigated", lambda f: f == pg.main_frame and cargas.append(f.url))
        async def falsa(route):
            r = await route.fetch(); t = await r.text()
            await route.fulfill(response=r, body=re.sub(r'name="app-version" content="[^"]+"', 'name="app-version" content="99"', t))
        await pg.goto("http://localhost:8765/?mapa=provincias"); await pg.wait_for_timeout(1500)
        await pg.route(re.compile(r".*[?&]v=\d{10,}.*"), falsa)  # la comprobación de versión ve la 99
        try: await pg.get_by_role("button", name="Entendido").click(timeout=1000)
        except Exception: pass
        await pg.evaluate("()=>{S.region='Aragón';sel.value='Aragón';S.mode='find';pressMode('find');newGame();try{closeSheet()}catch(e){}}")
        for _ in range(10):
            if await pg.evaluate("()=>!$('#endcard').hidden"): break
            await pg.evaluate("()=>onMapClick(S.cur)"); await pg.wait_for_timeout(1400)
        antes = len(cargas)
        await pg.evaluate("()=>window.dispatchEvent(new Event('focus'))")  # fuerza una comprobación de versión
        await pg.wait_for_timeout(8000)
        ok1 = await pg.evaluate("()=>!$('#endcard').hidden && Object.keys(S.results).length===3") and len(cargas) == antes
        print("Resultados siguen en pantalla con versión nueva esperando:", "SÍ" if ok1 else "NO"); fallos += not ok1
        await pg.click("#e-again"); await pg.wait_for_timeout(3000)
        ok2 = len(cargas) > antes
        print("Al pulsar «Jugar otra vez» se estrena la versión nueva:", "SÍ" if ok2 else "NO"); fallos += not ok2
        await b.close()
    print("TOTAL ERRORES:", fallos)
asyncio.run(main())

// Genera europa.js, america.js, asia.js, africa.js u oceania.js desde Natural Earth 1:50m (npm: world-atlas, topojson-*, polygon-clipping, d3-geo, flag-icons).
// Uso: node herramientas/continente.js as 0.1 asia.js AS "Asia"   (los países, capitales y regiones están en herramientas/paises.js)
const fs=require("fs"),topo=require("topojson-client"),srv=require("topojson-server"),simp=require("topojson-simplify"),pc=require("polygon-clipping"),d3=require("d3-geo");
const D=require("./paises.js");
const [,,K,Q,FILE,PRE,NOMBRE]=process.argv; const C=D[K];
const w=JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json"));
let fc=topo.feature(w,w.objects.countries).features.filter(f=>f.geometry&&f.id!=="010"&&(C.shift||f.id!=="242"));
// Somalilandia dentro de Somalia
const sl=fc.find(f=>f.properties.name==="Somaliland"),so=fc.find(f=>f.id==="706");
const polys=f=>f.geometry.type==="Polygon"?[f.geometry.coordinates]:f.geometry.coordinates;
so.geometry={type:"MultiPolygon",coordinates:pc.union(polys(so),polys(sl))}; fc=fc.filter(f=>f!==sl);
if(C.europa){ // Crimea dentro de Ucrania y Chipre entero (posición de España, la UE y la ONU); Kosovo, de fondo
  const ru=fc.find(f=>f.id==="643"),ua=fc.find(f=>f.id==="804"),cy=fc.find(f=>f.id==="196"),nc=fc.find(f=>f.properties.name==="N. Cyprus");
  const esCrimea=p=>{const [x,y]=d3.geoCentroid({type:"Polygon",coordinates:p});return x>32&&x<37&&y>44&&y<46.3;};
  const cr=polys(ru).filter(esCrimea); if(cr.length!==1) throw "Crimea no encontrada";
  ru.geometry={type:"MultiPolygon",coordinates:polys(ru).filter(p=>!esCrimea(p))};
  ua.geometry={type:"MultiPolygon",coordinates:pc.union(polys(ua),cr)};
  cy.geometry={type:"MultiPolygon",coordinates:pc.union(polys(cy),polys(nc))}; fc=fc.filter(f=>f!==nc);
  fc.find(f=>f.properties.name==="Kosovo").id="XK";
}
const A2={};C.l.forEach(r=>A2[r[1]]=r[0]);
const sh=x=>C.shift&&x< -100?x+360:x;
const [x0,y0,x1,y1]=C.bbox, box=[[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]];
const out=[];
fc.forEach(f=>{
  let g=polys(f).map(p=>p.map(r=>{ const xs=r.map(q=>q[0]), mx=Math.max(...xs), mn=Math.min(...xs); if(!C.shift) return r.some((q,i)=>i&&Math.abs(q[0]-r[i-1][0])>180)?r.map(q=>[q[0]<0?q[0]+360:q[0],q[1]]):r; /* anillos que cruzan los 180° (Rusia por Chukotka): se desenrollan antes de recortar */ if(mx< -100) return r.map(q=>[q[0]+360,q[1]]); if(mn< -100&&mx>100) return r.map(q=>[q[0]<0?q[0]+360:q[0],q[1]]); return r; }));
  let r; try{ r=pc.intersection(g,box);}catch(e){console.error("err",f.properties.name);return;}
  if(!r.length) return;
  const id=A2[f.id]||(f.id==="XK"?"XK":"x"+(f.id||f.properties.name.replace(/\W/g,"")));
  r=r.map(p=>p.map(ring=>ring.slice().reverse()));
  const ar=r.map(p=>d3.geoArea({type:"Polygon",coordinates:p})), mx=Math.max(...ar);
  const min=A2[f.id]?(C.islote||2e-7):3e-6;
  r=r.filter((p,i)=>ar[i]===mx||ar[i]>min);
  if(!A2[f.id]&&mx<min) return;
  const ya=out.find(o=>o.id===id); if(ya){ ya.geometry.coordinates=ya.geometry.coordinates.concat(r); return; } // un país en varias piezas (Australia y sus islotes)
  out.push({type:"Feature",id,properties:{},geometry:{type:"MultiPolygon",coordinates:r}});
});
// países que el mapa no trae (Tuvalu): un cuadradito en la capital
C.l.forEach(([a,,,,,,lo,la])=>{ if(out.some(f=>f.id===a)) return; lo=sh(lo); const e=0.06;
  out.push({type:"Feature",id:a,properties:{},geometry:{type:"MultiPolygon",coordinates:[[[[lo-e,la-e],[lo-e,la+e],[lo+e,la+e],[lo+e,la-e],[lo-e,la-e]]]]}}); console.log("añadido",a); });
let t=srv.topology({provinces:{type:"FeatureCollection",features:out}},6e4);
t=simp.presimplify(t);
// Más detalle en los países del juego que en el fondo, y ninguna isla se queda sin superficie
{ const peq=new Set(out.filter(f=>{const [[a,b],[c,d]]=d3.geoBounds(f);return c-a<1.5&&d-b<1.5;}).map(f=>f.id));
  const juego=new Set(), todo=x=>Array.isArray(x)?x.flatMap(todo):[x<0?~x:x];
  t.objects.provinces.geometries.forEach(g=>{ if(A2[g.id]===undefined&&C.l.some(r=>r[0]===g.id)) todo(g.arcs).forEach(a=>juego.add(a)); });
  const thr=simp.quantile(t,+Q), K=+(process.env.DETALLE||C.detalle||1);
  const KF=+(process.env.FONDO||C.fondo||1);
  t.arcs.forEach((a,i)=>{ a.forEach(q=>q[2]*=juego.has(i)?K:1/KF);
    const cerrado=a.length>4&&a[0][0]===a[a.length-1][0]&&a[0][1]===a[a.length-1][1];
    if(cerrado) a.slice(1,-1).sort((x,y)=>y[2]-x[2]).slice(0,3).forEach(q=>{ if(q[2]<thr) q[2]=Infinity; }); });
  t.objects.provinces.geometries.forEach(g=>{ if(peq.has(g.id)) todo(g.arcs).forEach(i=>t.arcs[i].forEach(q=>q[2]=Infinity)); });
  t=simp.simplify(t,thr);
  // fuera los trocitos que se quedan sin superficie al simplificar
  t.objects.provinces.geometries.forEach(g=>{ if(g.type!=="MultiPolygon") return;
    const ok=g.arcs.filter(pa=>d3.geoArea(topo.feature(t,{type:"Polygon",arcs:pa}))>1e-9);
    if(ok.length) g.arcs=ok; }); }
t=topo.quantize(t,6e4); // coordenadas enteras y en diferencias: el archivo pesa mucho menos
t.objects.provinces.geometries.forEach(g=>{g.properties={id:g.id};});
const tf=topo.feature(t,t.objects.provinces).features;
const vacios=C.l.map(r=>r[0]).filter(a=>{const f=tf.find(x=>x.id===a);return !f||!f.geometry;});
const P={},X={};C.l.forEach(([a,,n,alt,cap,rg,lo,la,ue])=>{P[a]=[n,alt,cap,C.regs[rg],ue||0];X[a]=[+sh(lo).toFixed(3),la];});
const s="// © 2026 Adela Moreno Vega y Carlos Moreno Otto. Datos del mapa de "+NOMBRE+" del Atlas.\n"+
"// Fronteras: Natural Earth 1:50m (dominio público), vía world-atlas, recortadas a "+NOMBRE+". Los territorios que no son países independientes se dibujan de fondo, sin preguntarse.\n"+
(C.europa?"// Crimea va dentro de Ucrania y Chipre, entero (posición de España, la UE y la ONU). Kosovo se dibuja aparte, sin preguntarse.\n":"")+
(C.shift?"// Las longitudes al oeste de 180° se guardan sumando 360 (así el océano Pacífico no se parte en dos).\n":"")+
"const "+PRE+"_TOPO = "+JSON.stringify(t)+";\n"+
"// id → [nombre, nombre alternativo, capital, región (geoesquema de la ONU, M49), "+(C.europa?"1 si es de la UE":"0")+"]\n"+
"const "+PRE+"_P = {"+Object.entries(P).map(([k,v])=>JSON.stringify(k)+":"+JSON.stringify(v)).join(",\n  ")+"};\n"+
"// Capitales [longitud, latitud]\nconst "+PRE+"_CAPXY = "+JSON.stringify(X)+";\n";
fs.writeFileSync("./"+FILE,s);
console.log(K,"bytes",s.length,"vacíos",vacios,"fondo",out.filter(f=>f.id[0]==="x").length);
for(const a of Object.keys(P)) if(!fs.existsSync("./banderas/"+a.toLowerCase()+".webp")&&!fs.existsSync("./banderas/"+a.toLowerCase()+".svg")) fs.copyFileSync("node_modules/flag-icons/flags/4x3/"+a.toLowerCase()+".svg","./banderas/"+a.toLowerCase()+".svg");

// Genera espana.js (mapa de España: provincias, comunidades, países vecinos y ríos).
// Uso: node herramientas/espana.js       (necesita npm: es-atlas, world-atlas, topojson-client, polygon-clipping)
// · Provincias y comunidades: es-atlas (IGN), tal cual.
// · Países vecinos: Natural Earth 1:10m vía world-atlas, recortados alrededor de España y redondeados a 3 decimales.
// · Ríos: Natural Earth (rivers_lake_centerlines) no está en npm; se conservan los que ya trae espana.js.
const fs=require("fs"),topo=require("topojson-client"),pc=require("polygon-clipping");
const lee=n=>{const s=fs.readFileSync("espana.js","utf8"),i=s.indexOf("const "+n+" = ")+n.length+9;return JSON.parse(s.slice(i,s.indexOf(";\n",i)));};
const TOPO=JSON.parse(fs.readFileSync("node_modules/es-atlas/es/provinces.json"));
const RIOS=lee("RIOS_ES");
const w=JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-10m.json"));
const N=[["250","Francia"],["504","Marruecos"],["012","Argelia"],["020","Andorra"],["620","Portugal"]];
const box=[[[-16,26],[7,26],[7,45.5],[-16,45.5],[-16,26]]], r3=x=>Math.round(x*1000)/1000;
const polys=g=>g.type==="Polygon"?[g.coordinates]:g.coordinates;
const V={type:"FeatureCollection",features:N.map(([id,nom])=>{
  const f=topo.feature(w,w.objects.countries).features.find(x=>x.id===id);
  const c=pc.intersection(polys(f.geometry),box).map(p=>p.map(r=>r.map(q=>[r3(q[0]),r3(q[1])]).filter((q,i,a)=>!i||q[0]!==a[i-1][0]||q[1]!==a[i-1][1]).reverse()))
    .filter(p=>p[0].length>3&&require("d3-geo").geoArea({type:"Polygon",coordinates:p})>2e-7); // sin islotes
  return {type:"Feature",id,properties:{name:nom},geometry:{type:"MultiPolygon",coordinates:c}};})};
const s="// © 2026 Adela Moreno Vega y Carlos Moreno Otto. Datos del mapa de España del Atlas (provincias y comunidades).\n"+
"// Provincias y comunidades: es-atlas (IGN); países vecinos y ríos: Natural Earth (dominio público). Se carga solo con el mapa de España.\n"+
"const TOPO_ES = "+JSON.stringify(TOPO)+";\nconst VECINOS_ES = "+JSON.stringify(V)+";\nconst RIOS_ES = "+JSON.stringify(RIOS)+";\n";
fs.writeFileSync("espana.js",s); console.log("espana.js",s.length,"bytes");

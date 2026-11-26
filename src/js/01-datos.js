// 5.0 · El mapa elegido lo decide el cargador de la página (src/js/cargador.js), que solo descarga sus datos
const MAPA = window.ATLAS_MAPA || "es";
// Coordenadas de las capitales [longitud, latitud]
const CAPXY_ES = {
  "01": [-2.672, 42.847], "02": [-1.856, 38.994], "03": [-0.481, 38.345], "04": [-2.464, 36.834], "05": [-4.700, 40.656],
  "06": [-6.970, 38.879], "07": [2.650, 39.570], "08": [2.170, 41.387], "09": [-3.700, 42.344], "10": [-6.372, 39.475],
  "11": [-6.288, 36.527], "12": [-0.038, 39.986], "13": [-3.927, 38.985], "14": [-4.779, 37.888], "15": [-8.411, 43.362],
  "16": [-2.137, 40.070], "17": [2.821, 41.979], "18": [-3.598, 37.177], "19": [-3.167, 40.633], "20": [-1.981, 43.318],
  "21": [-6.945, 37.261], "22": [-0.408, 42.140], "23": [-3.790, 37.779], "24": [-5.567, 42.599], "25": [0.620, 41.617],
  "26": [-2.445, 42.466], "27": [-7.556, 43.012], "28": [-3.704, 40.417], "29": [-4.421, 36.721], "30": [-1.130, 37.992],
  "31": [-1.645, 42.812], "32": [-7.864, 42.336], "33": [-5.849, 43.361], "34": [-4.528, 42.010], "35": [-15.413, 28.124],
  "36": [-8.645, 42.431], "37": [-5.664, 40.970], "38": [-16.252, 28.464], "39": [-3.804, 43.462], "40": [-4.118, 40.948],
  "41": [-5.984, 37.389], "42": [-2.468, 41.764], "43": [1.245, 41.119], "44": [-1.106, 40.344], "45": [-4.027, 39.863],
  "46": [-0.376, 39.470], "47": [-4.724, 41.652], "48": [-2.935, 43.263], "49": [-5.745, 41.503], "50": [-0.889, 41.649],
};

// id INE → [nombre, nombre cooficial/alternativo, capital, comunidad]
const P_ES = {
  "01": ["Álava", "Araba", "Vitoria-Gasteiz", "País Vasco"],
  "02": ["Albacete", "", "Albacete", "Castilla-La Mancha"],
  "03": ["Alicante", "Alacant", "Alicante", "Comunitat Valenciana"],
  "04": ["Almería", "", "Almería", "Andalucía"],
  "05": ["Ávila", "", "Ávila", "Castilla y León"],
  "06": ["Badajoz", "", "Badajoz", "Extremadura"],
  "07": ["Baleares", "Illes Balears", "Palma", "Illes Balears"],
  "08": ["Barcelona", "", "Barcelona", "Cataluña"],
  "09": ["Burgos", "", "Burgos", "Castilla y León"],
  "10": ["Cáceres", "", "Cáceres", "Extremadura"],
  "11": ["Cádiz", "", "Cádiz", "Andalucía"],
  "12": ["Castellón", "Castelló", "Castellón de la Plana", "Comunitat Valenciana"],
  "13": ["Ciudad Real", "", "Ciudad Real", "Castilla-La Mancha"],
  "14": ["Córdoba", "", "Córdoba", "Andalucía"],
  "15": ["A Coruña", "La Coruña", "A Coruña", "Galicia"],
  "16": ["Cuenca", "", "Cuenca", "Castilla-La Mancha"],
  "17": ["Girona", "Gerona", "Girona", "Cataluña"],
  "18": ["Granada", "", "Granada", "Andalucía"],
  "19": ["Guadalajara", "", "Guadalajara", "Castilla-La Mancha"],
  "20": ["Gipuzkoa", "Guipúzcoa", "San Sebastián", "País Vasco"],
  "21": ["Huelva", "", "Huelva", "Andalucía"],
  "22": ["Huesca", "", "Huesca", "Aragón"],
  "23": ["Jaén", "", "Jaén", "Andalucía"],
  "24": ["León", "", "León", "Castilla y León"],
  "25": ["Lleida", "Lérida", "Lleida", "Cataluña"],
  "26": ["La Rioja", "", "Logroño", "La Rioja"],
  "27": ["Lugo", "", "Lugo", "Galicia"],
  "28": ["Madrid", "", "Madrid", "Comunidad de Madrid"],
  "29": ["Málaga", "", "Málaga", "Andalucía"],
  "30": ["Murcia", "", "Murcia", "Región de Murcia"],
  "31": ["Navarra", "Nafarroa", "Pamplona", "Navarra"],
  "32": ["Ourense", "Orense", "Ourense", "Galicia"],
  "33": ["Asturias", "", "Oviedo", "Principado de Asturias"],
  "34": ["Palencia", "", "Palencia", "Castilla y León"],
  "35": ["Las Palmas", "", "Las Palmas de Gran Canaria", "Canarias"],
  "36": ["Pontevedra", "", "Pontevedra", "Galicia"],
  "37": ["Salamanca", "", "Salamanca", "Castilla y León"],
  "38": ["Santa Cruz de Tenerife", "", "Santa Cruz de Tenerife", "Canarias"],
  "39": ["Cantabria", "", "Santander", "Cantabria"],
  "40": ["Segovia", "", "Segovia", "Castilla y León"],
  "41": ["Sevilla", "", "Sevilla", "Andalucía"],
  "42": ["Soria", "", "Soria", "Castilla y León"],
  "43": ["Tarragona", "", "Tarragona", "Cataluña"],
  "44": ["Teruel", "", "Teruel", "Aragón"],
  "45": ["Toledo", "", "Toledo", "Castilla-La Mancha"],
  "46": ["Valencia", "València", "Valencia", "Comunitat Valenciana"],
  "47": ["Valladolid", "", "Valladolid", "Castilla y León"],
  "48": ["Bizkaia", "Vizcaya", "Bilbao", "País Vasco"],
  "49": ["Zamora", "", "Zamora", "Castilla y León"],
  "50": ["Zaragoza", "", "Zaragoza", "Aragón"],
  "51": ["Ceuta", "", "Ceuta", "Ciudad autónoma de Ceuta"],
  "52": ["Melilla", "", "Melilla", "Ciudad autónoma de Melilla"],
};
const VACIO = { type: "FeatureCollection", features: [] };
// id → [nombre, nombre alternativo, capital, zona]
const P_CA = {
  "01": ["Andalucía", "", "Sevilla", "Sur y Canarias"], "02": ["Aragón", "", "Zaragoza", "Este"], "03": ["Principado de Asturias", "Asturias", "Oviedo", "Norte"],
  "04": ["Illes Balears", "Islas Baleares", "Palma", "Este"], "05": ["Canarias", "", "Las Palmas de Gran Canaria y Santa Cruz de Tenerife", "Sur y Canarias"],
  "06": ["Cantabria", "", "Santander", "Norte"], "07": ["Castilla y León", "", "Valladolid", "Centro"], "08": ["Castilla-La Mancha", "", "Toledo", "Centro"],
  "09": ["Cataluña", "Catalunya", "Barcelona", "Este"], "10": ["Comunitat Valenciana", "Comunidad Valenciana", "Valencia", "Este"], "11": ["Extremadura", "", "Mérida", "Centro"],
  "12": ["Galicia", "", "Santiago de Compostela", "Norte"], "13": ["Comunidad de Madrid", "", "Madrid", "Centro"], "14": ["Región de Murcia", "", "Murcia", "Este"],
  "15": ["Navarra", "Comunidad Foral de Navarra", "Pamplona", "Norte"], "16": ["País Vasco", "Euskadi", "Vitoria-Gasteiz", "Norte"], "17": ["La Rioja", "", "Logroño", "Norte"],
  "18": ["Ceuta", "", "Ceuta", "Sur y Canarias"], "19": ["Melilla", "", "Melilla", "Sur y Canarias"] };
const CAPXY_CA = { "01": [-5.984, 37.389], "02": [-0.889, 41.649], "03": [-5.849, 43.361], "04": [2.65, 39.57], "05": [-15.413, 28.124], "06": [-3.804, 43.462],
  "07": [-4.724, 41.652], "08": [-4.027, 39.863], "09": [2.17, 41.387], "10": [-0.376, 39.47], "11": [-6.343, 38.916], "12": [-8.545, 42.878], "13": [-3.704, 40.417],
  "14": [-1.13, 37.992], "15": [-1.645, 42.812], "16": [-2.672, 42.847], "17": [-2.445, 42.466] };
const GENT_CA = { "01": "andaluces", "02": "aragoneses", "03": "asturianos", "04": "baleares", "05": "canarios", "06": "cántabros", "07": "castellanos y leoneses|castellanoleoneses",
  "08": "castellanomanchegos", "09": "catalanes", "10": "valencianos", "11": "extremeños", "12": "gallegos", "13": "madrileños", "14": "murcianos", "15": "navarros",
  "16": "vascos", "17": "riojanos", "18": "ceutíes", "19": "melillenses" };
// 5.0 · Cada mapa es una ficha: sus datos, sus palabras y sus reglas. Solo se monta la del mapa elegido
// (los datos de los demás ni se descargan). Para añadir un mapa basta con añadir su ficha y su archivo de datos.
// Palabras: «uno» y «unos» (provincia/provincias), «la» o «el», y «busca» (Encuéntrala/Encuéntralo)
const PAL_PROV = { uno: "provincia", unos: "provincias", Uno: "Provincia", art: "la", busca: "Encuéntrala", toca: "Toca la provincia" };
const PAL_COM = { uno: "comunidad", unos: "comunidades", Uno: "Comunidad", art: "la", busca: "Encuéntrala", toca: "Toca la comunidad" };
const PAL_PAIS = { uno: "país", unos: "países", Uno: "País", art: "el", busca: "Encuéntralo", toca: "Toca el país" };
const CONTINENTES = {
  am: () => ({ topo: AM_TOPO, P: AM_P, cap: AM_CAPXY, cont: "América", sub: "países, del Norte, Centro, Caribe y Sur", rot: [82, -18],
    dots: ["AG", "BB", "DM", "GD", "KN", "LC", "VC", "TT"], extra: { zona: "Habla hispana", info: " · Se habla español", voz: " Se habla español." },
    paises: [["Groenlandia (Dinamarca)", [-41, 74], 0.8], ["Guayana Francesa", [-53.2, 3.9], 0.42], ["Puerto Rico (EE. UU.)", [-66.4, 18.95], 0.42], ["Islas Malvinas", [-59.3, -50.9], 0.42]],
    capIgual: ["MX", "GT", "PA"], capTxt: "Sin México, Guatemala y Panamá, cuya capital lleva el nombre del país" }),
  as: () => ({ topo: AS_TOPO, P: AS_P, cap: AS_CAPXY, cont: "Asia", sub: "países, de Turquía a Japón", rot: [-88, -28],
    dots: ["MV", "BH", "SG"], paises: [["Rusia", [92, 56.5], 0.9], ["Taiwán", [121, 23.7], 0.45], ["Egipto", [29.5, 27], 0.6], ["Chipre", [33.2, 35.1], 0.4]],
    capIgual: ["KW", "SG"], capTxt: "Sin Kuwait y Singapur, que se llaman como su país", sinCap: ["IL", "PS"] }),
  af: () => ({ topo: AF_TOPO, P: AF_P, cap: AF_CAPXY, cont: "África", sub: "países, del Mediterráneo al cabo de Buena Esperanza", rot: [-18, -2],
    dots: ["CV", "ST", "SC", "KM", "MU"], paises: [["Sáhara Occidental", [-12.8, 24.6], 0.5], ["Islas Canarias (España)", [-15.6, 29.2], 0.42], ["Arabia Saudí", [45, 23], 0.6], ["España", [-4, 38.2], 0.5]],
    capIgual: ["DJ", "TN"], capTxt: "Sin Yibuti y Túnez, cuya capital se llama como el país" }),
  oc: () => ({ topo: OC_TOPO, P: OC_P, cap: OC_CAPXY, cont: "Oceanía", sub: "países, de Australia a las islas del Pacífico", rot: [-162, 14],
    dots: ["KI", "MH", "FM", "NR", "PW", "WS", "TO", "TV"], paises: [["Indonesia", [117, -1.5], 0.7], ["Filipinas", [122.5, 12], 0.55], ["Nueva Caledonia (Francia)", [165.5, -22.2], 0.4]],
    capIgual: [], capTxt: "En Oceanía ninguna capital se llama como su país" }),
};
const FICHAS = Object.assign({
  es: () => ({ espana: true, topo: TOPO_ES, P: P_ES, cap: CAPXY_ES, vecinos: VECINOS_ES, rios: RIOS_ES, pal: PAL_PROV, cont: "España", toda: "Toda España",
    dots: ["51", "52"], noShape: [], can: ["35", "38"], islasCentro: "07", kp: "atlas:", archivo: "atlas-provincias.png",
    brand: 'Atlas · Provincias<small><span class="num">50</span> provincias y <span class="num">2</span> ciudades autónomas</small>' }),
  ca: () => ({ espana: true, topo: { type: "Topology", bbox: TOPO_ES.bbox, transform: TOPO_ES.transform, arcs: TOPO_ES.arcs,
      objects: { provinces: TOPO_ES.objects.autonomous_regions, autonomous_regions: TOPO_ES.objects.autonomous_regions } },
    P: P_CA, cap: CAPXY_CA, vecinos: VECINOS_ES, rios: RIOS_ES, pal: PAL_COM, cont: "España", toda: "Toda España",
    dots: ["18", "19"], noShape: [], can: ["05"], islasCentro: "04", kp: "atlas:ca:", archivo: "atlas-comunidades.png",
    capIgual: ["13", "14", "18", "19"], capTxt: "Sin Madrid, Murcia, Ceuta y Melilla, cuya capital se llama como la comunidad",
    brand: 'Atlas · Comunidades<small><span class="num">17</span> comunidades y <span class="num">2</span> ciudades autónomas</small>' }),
  eu: () => ({ topo: EU_TOPO, P: EU_P, cap: EU_CAPXY, pal: PAL_PAIS, cont: "Europa", dots: ["AD", "MC", "SM", "VA", "LI", "MT", "LU"], conRusia: true,
    extra: { zona: "Unión Europea", info: " · Unión Europea", voz: " De la Unión Europea." },
    capTxt: "Sin Andorra, Mónaco, San Marino, el Vaticano y Luxemburgo, que se llaman como su país",
    brand: 'Atlas de Europa<small><span class="num">45</span> países · también las provincias de España</small>' }),
}, CONTINENTES);
const M = (() => { // la ficha del mapa elegido, con lo que falte rellenado
  const f = FICHAS[MAPA](), conti = !!CONTINENTES[MAPA];
  f.pal = f.pal || PAL_PAIS; f.toda = f.toda || "Toda " + f.cont; f.kp = f.kp || "atlas:" + MAPA + ":";
  f.noShape = f.noShape || (f.conRusia ? f.dots.concat("RU") : f.dots.slice()); f.can = f.can || [];
  f.archivo = f.archivo || "atlas-" + f.cont.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ".png";
  if (conti) f.brand = 'Atlas de ' + f.cont + '<small><span class="num">' + Object.keys(f.P).length + '</span> ' + f.sub + '</small>';
  f.continente = conti;
  return f;
})();
// Atajos que usa el resto del código: EU = mapa de países; EUR = Europa; AM = un continente nuevo (CF, su ficha); CA = comunidades
const CF = M.continente ? M : null;
const AM = !!CF;
const EUR = MAPA === "eu";
const EU = !M.espana;
const CA = MAPA === "ca";
// Textos que cambian según el mapa: en comunidades, los de provincias se dicen de comunidades (mismo género)
const aCom = t => typeof t === "string" ? t.replace(/provincias/g, "comunidades").replace(/provincia/g, "comunidad").replace(/Provincias/g, "Comunidades").replace(/Provincia/g, "Comunidad") : t;
const tx = (es, eu, am) => AM && am !== undefined && am !== null ? am : EU ? eu : CA ? aCom(es) : es;
const KP = M.kp; // lo guardado (récords, repaso, zona) va aparte en cada mapa
const TOPO = M.topo, VECINOS = M.vecinos || VACIO, RIOS = M.rios || VACIO;
const CAPXY = M.cap, P = M.P;
// Europa: los países diminutos llevan un punto (como Ceuta y Melilla) y no salen en Siluetas
const DOTS = M.dots;
const NO_SHAPE = M.noShape;
// Banderas parecidas: salen juntas como opciones trampa
const PARECIDAS = [["FR", "NL", "LU", "RU", "SK", "SI", "RS", "HR"], ["RO", "AD", "MD", "BE"], ["IT", "IE", "HU", "BG"], ["MC", "PL", "AT", "LV"],
  ["DE", "BE", "LT"], ["DK", "NO", "IS", "SE", "FI", "CH", "MT", "GB"], ["UA", "SE", "LI", "SM"], ["EE", "FI", "GR", "CY"], ["AL", "ME", "RS", "MK"],
  ["ES", "PT", "VA", "SM", "AD"], ["BA", "CZ", "BY", "MK"],
  // América
  ["AR", "UY", "HN", "SV", "NI", "GT"], ["CO", "EC", "VE"], ["CU", "CL", "PA", "US"], ["PE", "CA"], ["CR", "DO", "HT", "PY"], ["PY", "BO", "SR"],
  ["MX", "PE", "BO"], ["BR", "JM", "DM"], ["BB", "GY", "SR", "KN"], ["LC", "AG", "BS", "TT", "GD", "VC"], ["BZ", "HT", "NI", "SV"],
  // Asia, África y Oceanía
  ["ID", "SG", "PL", "MC", "BH", "QA"], ["IQ", "YE", "EG", "SY", "SD", "PS", "JO", "KW", "AE"], ["CN", "VN", "TR", "TN", "MA"], ["IN", "NE", "CI", "IE", "NG"],
  ["KR", "JP", "BD", "PW", "LA"], ["TH", "CR", "KH", "LA", "KP"], ["MY", "LR", "US"], ["AM", "CO", "GA", "SL", "MU"], ["AZ", "UZ", "SL", "TM"],
  ["ML", "GN", "SN", "CM", "BJ", "GH", "ET", "BO", "LT"], ["TD", "RO", "AD", "MD"], ["GM", "SL", "KE", "SS", "MW"], ["BF", "MG", "BJ", "GW", "SR"],
  ["AU", "NZ", "TV", "FJ"], ["SO", "FM", "VN"], ["DJ", "TL", "CU", "ST", "MZ", "SS", "PS", "JO"], ["ZA", "ZW", "KM", "SC", "MU"],
  ["CG", "TZ", "SB", "NA", "CD", "MH", "KN"], ["LB", "CA", "PE", "AT"], ["WS", "TO", "TW", "MM"], ["BW", "AR", "SV", "HN"], ["KZ", "PW", "UA", "SO"],
  // Provincias de España
  ["04", "22", "50", "44"], ["08", "17", "25", "07", "43"], ["05", "13", "40", "31", "43"], ["09", "19", "42", "34", "14"], ["01", "02", "24", "37", "47", "48", "30"],
  ["06", "32", "29", "21", "33"], ["27", "35", "36", "38", "39"], ["11", "18", "23", "41"], ["10", "45", "16", "49"], ["51", "52", "20", "28"]];
// Descripción de cada bandera: se lee con el lector de pantalla y se enseña al responder (no depende solo del color)
const BANDERA = {
  ES: "franjas horizontales roja, amarilla (el doble de ancha) y roja, con el escudo", PT: "verde a la izquierda y roja a la derecha, con el escudo sobre una esfera armilar",
  FR: "franjas verticales azul, blanca y roja", AD: "franjas verticales azul, amarilla y roja, con el escudo en el centro", MC: "mitad de arriba roja y mitad de abajo blanca",
  IT: "franjas verticales verde, blanca y roja", SM: "mitad de arriba blanca y mitad de abajo azul celeste, con el escudo", VA: "cuadrada, mitad amarilla y mitad blanca, con las llaves y la tiara",
  MT: "mitad blanca y mitad roja, con la cruz de San Jorge arriba a la izquierda", CH: "cuadrada y roja, con una cruz blanca", LI: "mitad de arriba azul y mitad de abajo roja, con una corona dorada",
  AT: "franjas horizontales roja, blanca y roja", DE: "franjas horizontales negra, roja y dorada", BE: "franjas verticales negra, amarilla y roja",
  NL: "franjas horizontales roja, blanca y azul", LU: "franjas horizontales roja, blanca y azul celeste", GB: "azul, con las cruces roja y blanca de la Union Jack",
  IE: "franjas verticales verde, blanca y naranja", IS: "azul, con una cruz nórdica roja bordeada de blanco", NO: "roja, con una cruz nórdica azul bordeada de blanco",
  SE: "azul, con una cruz nórdica amarilla", FI: "blanca, con una cruz nórdica azul", DK: "roja, con una cruz nórdica blanca", EE: "franjas horizontales azul, negra y blanca",
  LV: "granate, con una franja blanca estrecha en el centro", LT: "franjas horizontales amarilla, verde y roja", PL: "mitad de arriba blanca y mitad de abajo roja",
  CZ: "mitad de arriba blanca y de abajo roja, con un triángulo azul a la izquierda", SK: "franjas horizontales blanca, azul y roja, con el escudo de la doble cruz a la izquierda",
  HU: "franjas horizontales roja, blanca y verde", SI: "franjas horizontales blanca, azul y roja, con el escudo del monte Triglav arriba a la izquierda",
  HR: "franjas horizontales roja, blanca y azul, con el escudo de cuadros rojos y blancos", BA: "azul, con un triángulo amarillo y una fila de estrellas blancas",
  RS: "franjas horizontales roja, azul y blanca, con el escudo del águila de dos cabezas", ME: "roja con borde dorado y un águila dorada de dos cabezas",
  AL: "roja, con un águila negra de dos cabezas", MK: "roja, con un sol amarillo de ocho rayos", GR: "nueve franjas azules y blancas, con una cruz blanca sobre azul arriba a la izquierda",
  BG: "franjas horizontales blanca, verde y roja", RO: "franjas verticales azul, amarilla y roja", MD: "franjas verticales azul, amarilla y roja, con el escudo del águila en el centro",
  UA: "mitad de arriba azul y mitad de abajo amarilla", BY: "roja arriba y verde abajo, con una franja de bordado rojo y blanco a la izquierda",
  RU: "franjas horizontales blanca, azul y roja", CY: "blanca, con el mapa de la isla en color cobre y dos ramas de olivo verdes",
  // América
  CA: "roja a los lados y blanca en el centro, con una hoja de arce roja", US: "trece franjas rojas y blancas, con 50 estrellas blancas sobre azul arriba a la izquierda",
  MX: "franjas verticales verde, blanca y roja, con el águila sobre un nopal en el centro", GT: "franjas verticales azul celeste, blanca y azul celeste, con el escudo del quetzal",
  BZ: "azul con una franja roja arriba y otra abajo, con el escudo en un círculo blanco", HN: "franjas horizontales azul, blanca y azul, con cinco estrellas azules en el centro",
  SV: "franjas horizontales azul, blanca y azul, con el escudo del triángulo en el centro", NI: "franjas horizontales azul, blanca y azul, con el escudo del triángulo y el arcoíris",
  CR: "franjas horizontales azul, blanca, roja (el doble de ancha), blanca y azul", PA: "cuatro cuartos: blanco con estrella azul, rojo, azul y blanco con estrella roja",
  CU: "cinco franjas azules y blancas, con un triángulo rojo y una estrella blanca a la izquierda", DO: "una cruz blanca que deja cuartos azules y rojos, con el escudo en el centro",
  HT: "mitad de arriba azul y mitad de abajo roja, con el escudo en un recuadro blanco", JM: "una cruz amarilla en aspa, con triángulos verdes arriba y abajo y negros a los lados",
  BS: "franjas horizontales aguamarina, amarilla y aguamarina, con un triángulo negro a la izquierda", TT: "roja, con una franja diagonal negra bordeada de blanco",
  BB: "franjas verticales azul, amarilla y azul, con un tridente negro en el centro", AG: "roja, con un triángulo hacia abajo negro, azul y blanco y un sol amarillo naciente",
  DM: "verde, con una cruz amarilla, negra y blanca y un disco rojo con un loro en el centro", GD: "un borde rojo con seis estrellas amarillas y en el centro triángulos amarillos y verdes",
  KN: "una franja diagonal negra bordeada de amarillo, con dos estrellas blancas, entre verde y rojo", LC: "azul celeste, con un triángulo amarillo, otro negro y otro blanco en el centro",
  VC: "franjas verticales azul, amarilla (la más ancha) y verde, con tres rombos verdes en forma de V", CO: "franjas horizontales amarilla (la mitad de la bandera), azul y roja",
  VE: "franjas horizontales amarilla, azul y roja, con un arco de ocho estrellas blancas", GY: "verde, con una punta de flecha amarilla bordeada de blanco y un triángulo rojo bordeado de negro",
  SR: "franjas horizontales verde, blanca, roja (la más ancha), blanca y verde, con una estrella amarilla", EC: "franjas horizontales amarilla (la mitad), azul y roja, con el escudo del cóndor",
  PE: "franjas verticales roja, blanca y roja", BR: "verde, con un rombo amarillo y un círculo azul con estrellas y una banda blanca",
  BO: "franjas horizontales roja, amarilla y verde, con el escudo en el centro", PY: "franjas horizontales roja, blanca y azul, con un escudo redondo en el centro",
  CL: "mitad de abajo roja; arriba, blanca con un cuadrado azul y una estrella blanca a la izquierda", AR: "franjas horizontales azul celeste, blanca y azul celeste, con un sol amarillo en el centro",
  UY: "nueve franjas blancas y azules, con un sol amarillo sobre blanco arriba a la izquierda",
  // Asia, África y Oceanía
  KZ: "azul celeste, con un sol y un águila dorados y una franja de adornos a la izquierda", KG: "roja, con un sol amarillo y la corona de una yurta en el centro",
  TJ: "franjas horizontales roja, blanca (la más ancha) y verde, con una corona y siete estrellas doradas", TM: "verde, con una franja vertical granate de dibujos de alfombra y una media luna con cinco estrellas",
  UZ: "franjas horizontales azul, blanca y verde separadas por líneas rojas, con una media luna y doce estrellas blancas", CN: "roja, con una estrella amarilla grande y cuatro pequeñas arriba a la izquierda",
  JP: "blanca, con un círculo rojo en el centro", KP: "azul arriba y abajo y roja en el centro, con un círculo blanco y una estrella roja",
  KR: "blanca, con un círculo rojo y azul en el centro y cuatro grupos de barras negras", MN: "franjas verticales roja, azul y roja, con el símbolo soyombo amarillo a la izquierda",
  AF: "franjas verticales negra, roja y verde, con el escudo blanco en el centro", BD: "verde, con un círculo rojo un poco a la izquierda del centro",
  BT: "partida en diagonal, amarilla arriba y naranja abajo, con un dragón blanco", IN: "franjas horizontales azafrán, blanca y verde, con una rueda azul en el centro",
  IR: "franjas horizontales verde, blanca y roja, con el emblema rojo en el centro", MV: "roja, con un rectángulo verde y una media luna blanca en el centro",
  NP: "con forma de dos triángulos, uno encima de otro, rojos con borde azul y con una luna y un sol blancos", PK: "verde, con una franja blanca a la izquierda y una media luna y una estrella blancas",
  LK: "un león amarillo sobre granate, con dos franjas verticales verde y naranja a la izquierda y borde amarillo", BN: "amarilla, con dos franjas diagonales blanca y negra y el escudo rojo en el centro",
  KH: "franjas horizontales azul, roja (doble de ancha) y azul, con el templo de Angkor en blanco", ID: "mitad de arriba roja y mitad de abajo blanca",
  LA: "franjas horizontales roja, azul (doble de ancha) y roja, con un círculo blanco", MY: "catorce franjas rojas y blancas, con una media luna y una estrella amarillas sobre azul arriba a la izquierda",
  MM: "franjas horizontales amarilla, verde y roja, con una gran estrella blanca", PH: "mitad de arriba azul y mitad de abajo roja, con un triángulo blanco con un sol y tres estrellas amarillas",
  SG: "mitad de arriba roja y mitad de abajo blanca, con una media luna y cinco estrellas blancas", TH: "franjas horizontales roja, blanca, azul (doble de ancha), blanca y roja",
  TL: "roja, con un triángulo amarillo y otro negro con una estrella blanca a la izquierda", VN: "roja, con una estrella amarilla en el centro",
  AM: "franjas horizontales roja, azul y naranja", AZ: "franjas horizontales azul, roja y verde, con una media luna y una estrella blancas",
  BH: "roja, con una franja blanca en dientes de sierra a la izquierda", GE: "blanca, con una cruz roja grande y cuatro cruces rojas pequeñas",
  IQ: "franjas horizontales roja, blanca y negra, con una inscripción verde en el centro", IL: "blanca, con dos franjas azules y la estrella de David azul en el centro",
  JO: "franjas horizontales negra, blanca y verde, con un triángulo rojo y una estrella blanca a la izquierda", KW: "franjas horizontales verde, blanca y roja, con un trapecio negro a la izquierda",
  LB: "franjas horizontales roja, blanca (doble de ancha) y roja, con un cedro verde", OM: "franjas horizontales blanca, roja y verde, con una franja vertical roja a la izquierda y el emblema blanco",
  PS: "franjas horizontales negra, blanca y verde, con un triángulo rojo a la izquierda", QA: "granate, con una franja blanca en dientes de sierra a la izquierda",
  SA: "verde, con una inscripción y una espada blancas", SY: "franjas horizontales verde, blanca y negra, con tres estrellas rojas",
  TR: "roja, con una media luna y una estrella blancas", AE: "franjas horizontales verde, blanca y negra, con una franja vertical roja a la izquierda",
  YE: "franjas horizontales roja, blanca y negra", DZ: "mitad verde y mitad blanca, con una media luna y una estrella rojas",
  EG: "franjas horizontales roja, blanca y negra, con un águila dorada en el centro", LY: "franjas horizontales roja, negra (doble de ancha) y verde, con una media luna y una estrella blancas",
  MA: "roja, con una estrella verde de cinco puntas en el centro", SD: "franjas horizontales roja, blanca y negra, con un triángulo verde a la izquierda",
  TN: "roja, con un círculo blanco con una media luna y una estrella rojas", BJ: "verde a la izquierda; a la derecha, amarilla arriba y roja abajo",
  BF: "mitad de arriba roja y mitad de abajo verde, con una estrella amarilla", CV: "azul, con franjas blanca, roja y blanca abajo y un círculo de diez estrellas amarillas",
  CI: "franjas verticales naranja, blanca y verde", GM: "franjas horizontales roja, azul y verde, separadas por líneas blancas",
  GH: "franjas horizontales roja, amarilla y verde, con una estrella negra", GN: "franjas verticales roja, amarilla y verde",
  GW: "franja vertical roja con una estrella negra a la izquierda; a la derecha, amarilla arriba y verde abajo", LR: "once franjas rojas y blancas, con una estrella blanca sobre azul arriba a la izquierda",
  ML: "franjas verticales verde, amarilla y roja", MR: "verde, con franjas rojas arriba y abajo y una media luna y una estrella amarillas",
  NE: "franjas horizontales naranja, blanca y verde, con un círculo naranja", NG: "franjas verticales verde, blanca y verde",
  SN: "franjas verticales verde, amarilla y roja, con una estrella verde", SL: "franjas horizontales verde, blanca y azul",
  TG: "cinco franjas verdes y amarillas, con una estrella blanca sobre rojo arriba a la izquierda", AO: "mitad de arriba roja y mitad de abajo negra, con media rueda dentada, un machete y una estrella amarillos",
  CM: "franjas verticales verde, roja y amarilla, con una estrella amarilla en el centro", CF: "franjas horizontales azul, blanca, verde y amarilla cruzadas por una franja vertical roja, con una estrella amarilla",
  TD: "franjas verticales azul, amarilla y roja", CG: "partida en diagonal: verde arriba, una franja amarilla y roja abajo",
  CD: "azul celeste, con una franja diagonal roja bordeada de amarillo y una estrella amarilla", GQ: "franjas horizontales verde, blanca y roja, con un triángulo azul a la izquierda y el escudo del árbol",
  GA: "franjas horizontales verde, amarilla y azul", ST: "franjas horizontales verde, amarilla (la más ancha) y verde, con un triángulo rojo y dos estrellas negras",
  BI: "una cruz blanca en aspa con cuartos rojos y verdes y un círculo blanco con tres estrellas rojas", KM: "franjas amarilla, blanca, roja y azul, con un triángulo verde con una media luna y cuatro estrellas blancas",
  DJ: "azul celeste arriba y verde abajo, con un triángulo blanco con una estrella roja", ER: "un triángulo rojo con una rama de olivo dorada, entre un triángulo verde arriba y uno azul abajo",
  ET: "franjas horizontales verde, amarilla y roja, con un círculo azul y una estrella amarilla", KE: "franjas horizontales negra, roja y verde separadas por líneas blancas, con un escudo masái y dos lanzas",
  MG: "blanca a la izquierda; a la derecha, roja arriba y verde abajo", MW: "franjas horizontales negra, roja y verde, con un sol rojo naciente arriba",
  MU: "cuatro franjas horizontales roja, azul, amarilla y verde", MZ: "franjas verde, negra y amarilla separadas por blanco, con un triángulo rojo con un fusil, una azada y un libro",
  RW: "azul celeste (la mitad de arriba), amarilla y verde, con un sol amarillo arriba a la derecha", SC: "cinco franjas en abanico azul, amarilla, roja, blanca y verde que salen de la esquina de abajo a la izquierda",
  SO: "azul celeste, con una estrella blanca en el centro", SS: "franjas horizontales negra, roja y verde separadas por blanco, con un triángulo azul con una estrella amarilla",
  TZ: "una franja diagonal negra bordeada de amarillo, entre verde arriba y azul abajo", UG: "seis franjas negras, amarillas y rojas, con una grulla en un círculo blanco",
  ZM: "verde, con un águila naranja y tres franjas verticales roja, negra y naranja abajo a la derecha", ZW: "siete franjas verdes, amarillas, rojas y negra, con un triángulo blanco con un pájaro y una estrella roja",
  BW: "azul celeste, con una franja negra bordeada de blanco en el centro", SZ: "azul, amarilla y roja (la más ancha), con un escudo negro y blanco y dos lanzas",
  LS: "franjas horizontales azul, blanca (la más ancha) y verde, con un sombrero basoto negro", NA: "una franja diagonal roja bordeada de blanco, entre azul arriba con un sol amarillo y verde abajo",
  ZA: "una Y verde bordeada de blanco y amarillo, con un triángulo negro a la izquierda, roja arriba y azul abajo", AU: "azul, con la Union Jack arriba a la izquierda, una estrella grande de siete puntas y la Cruz del Sur blanca",
  NZ: "azul, con la Union Jack arriba a la izquierda y cuatro estrellas rojas bordeadas de blanco", FJ: "azul celeste, con la Union Jack arriba a la izquierda y un escudo",
  PG: "partida en diagonal: roja arriba con un ave del paraíso amarilla, y negra abajo con la Cruz del Sur blanca", SB: "una franja diagonal amarilla entre azul arriba, con cinco estrellas blancas, y verde abajo",
  VU: "roja arriba y verde abajo, con una Y amarilla bordeada de negro y un triángulo negro con un colmillo", KI: "roja arriba con un ave y un sol amarillos, y franjas onduladas azules y blancas abajo",
  MH: "azul, con dos franjas diagonales naranja y blanca y una estrella blanca", FM: "azul celeste, con cuatro estrellas blancas en el centro",
  NR: "azul, con una franja amarilla estrecha en el centro y una estrella blanca de doce puntas debajo", PW: "azul celeste, con un círculo amarillo un poco a la izquierda",
  WS: "roja, con un rectángulo azul arriba a la izquierda con cinco estrellas blancas", TO: "roja, con un rectángulo blanco arriba a la izquierda con una cruz roja",
  TV: "azul celeste, con la Union Jack arriba a la izquierda y nueve estrellas amarillas",
};
// 4.1 · Banderas de España: las de las provincias (banderas/es/<id>.svg) y las de las comunidades (banderas/es/ca-<n>.svg)
// Alicante, Castellón, Valencia, Lleida y A Coruña no tienen bandera provincial oficial: no salen en Banderas
const SIN_BANDERA = ["03", "12", "46", "15"];
// Comprobado el 26-11-2026 (Flags of the World): estas tres no están en uso hoy y no se preguntan; sí se ven en Explorar con su nota
const NO_SE_PREGUNTA = ["17", "25", "43"];
const NOTA_BANDERA = { "08": "Es la bandera de la Diputación de Barcelona (1971).", "17": "Bandera antigua de la Diputación de Girona, usada hasta 2001.",
  "22": "Es la bandera de la Diputación de Huesca.", "25": "Bandera antigua de la Diputación de Lleida.",
  "43": "No es oficial: la Diputación de Tarragona la usa solo en algunos actos.", "49": "Es la de la ciudad (la Seña Bermeja): la provincia no tiene bandera registrada." };
const CA_N = { "Andalucía": "01", "Aragón": "02", "Principado de Asturias": "03", "Illes Balears": "04", "Canarias": "05", "Cantabria": "06", "Castilla y León": "07",
  "Castilla-La Mancha": "08", "Cataluña": "09", "Comunitat Valenciana": "10", "Extremadura": "11", "Galicia": "12", "Comunidad de Madrid": "13", "Región de Murcia": "14",
  "Navarra": "15", "País Vasco": "16", "La Rioja": "17", "Ciudad autónoma de Ceuta": "18", "Ciudad autónoma de Melilla": "19" };
const flagCa = () => !EU && !CA && $("#flagCa").checked; // en Banderas de España, ¿se preguntan las comunidades?
const FCA = () => S.mode === "flag" && flagCa();
// Descripción de cada bandera de España (comunidades y provincias), para el lector de pantalla y al responder
const BANDERA_CA = {
  "01": "franjas horizontales verde, blanca y verde, con el escudo de Hércules y dos leones", "02": "cuatro barras rojas sobre amarillo, con el escudo de Aragón",
  "03": "azul, con la Cruz de la Victoria amarilla", "04": "cinco franjas rojas sobre amarillo, con un castillo blanco sobre morado arriba a la izquierda",
  "05": "franjas verticales blanca, azul y amarilla, con el escudo de los perros", "06": "mitad de arriba blanca y mitad de abajo roja, con el escudo en el centro",
  "07": "cuartelada: castillos dorados sobre rojo y leones morados sobre blanco", "08": "partida en vertical: un castillo dorado sobre granate a la izquierda y blanca a la derecha",
  "09": "cuatro barras rojas sobre amarillo (la senyera)", "10": "cuatro barras rojas sobre amarillo, con una franja azul con coronas junto al asta",
  "11": "franjas horizontales verde, blanca y negra, con el escudo en el centro", "12": "blanca, con una franja diagonal azul celeste y el escudo del cáliz",
  "13": "roja, con siete estrellas blancas de cinco puntas", "14": "granate, con cuatro castillos dorados arriba a la izquierda y siete coronas abajo a la derecha",
  "15": "roja, con el escudo de las cadenas doradas y la corona", "16": "roja, con un aspa verde y una cruz blanca encima (la ikurriña)",
  "17": "franjas horizontales roja, blanca, verde y amarilla, con el escudo en el centro", "18": "ocho triángulos blancos y negros que salen del centro, con el escudo de Portugal",
  "19": "azul celeste, con el escudo de la ciudad en el centro",
};
const BANDERA_ES = {
  "01": "carmesí, con el escudo coronado en el centro", "02": "granate, con el escudo coronado en el centro",
  "04": "blanca, con una cruz roja y el escudo en el centro", "05": "roja, con el escudo en el centro",
  "06": "azul, con el escudo del león en el centro", "07": BANDERA_CA["04"],
  "08": "cuatro barras rojas sobre amarillo, con un rombo blanco con una cruz roja", "09": "morada, con el escudo en el centro",
  "10": "partida: un león rojo sobre morado a la izquierda y un castillo dorado sobre blanco a la derecha", "11": "verde, con un borde de castillos y leones y el escudo de las columnas de Hércules",
  "13": "roja, con el escudo en el centro", "14": "morada oscura, con el escudo del león en el centro",
  "16": "franjas horizontales amarilla, blanca y roja, con el escudo en el centro", "17": "cuatro barras rojas sobre amarillo, con el escudo de cuadros y una corona de laurel",
  "18": "verde oliva, con el escudo de la granada en el centro", "19": "morada, con el escudo en el centro",
  "20": "blanca, con el escudo de los tres árboles sostenido por dos salvajes", "21": "azul, con dos escudos coronados en el centro",
  "22": "blanca, con una cruz roja y el escudo en el centro", "23": "verde, con el escudo en el centro",
  "24": "granate, con el escudo del león en el centro", "25": "cuatro barras rojas sobre amarillo, con un rombo azul con tres flores de lis",
  "26": BANDERA_CA["17"], "27": "mitad de arriba azul y mitad de abajo roja, con el escudo en el centro",
  "28": BANDERA_CA["13"], "29": "azul celeste, con un rectángulo blanco con el escudo en el centro",
  "30": BANDERA_CA["14"], "31": BANDERA_CA["15"],
  "32": "azul, con el escudo del puente y una fila de puntos blancos a la derecha", "33": BANDERA_CA["03"],
  "34": "morada, con el escudo negro y dorado en el centro", "35": "azul a la izquierda y blanca a la derecha, con el escudo en el centro",
  "36": "partida en diagonal, blanca arriba y azul abajo, con el escudo en el centro", "37": "granate, con el escudo en el centro",
  "38": "azul oscuro, con una cruz blanca en aspa y el escudo en el centro", "39": BANDERA_CA["06"],
  "40": "roja, con el escudo en el centro", "41": "verde, con el escudo en el centro",
  "42": "morada, con el escudo en el centro", "43": "roja, con el escudo de barras y el texto «Diputación Provincial de Tarragona»",
  "44": "blanca, con una cruz roja y el escudo rodeado de laurel", "45": "carmesí, con el águila negra de dos cabezas y las columnas de Hércules",
  "47": "granate, con el escudo dentro de un círculo verde", "48": "granate, con el escudo del árbol de Gernika",
  "49": "ocho franjas rojas y una verde arriba, acabadas en picos (la Seña Bermeja)", "50": "blanca, con una cruz roja y el escudo en el centro",
  "51": BANDERA_CA["18"], "52": BANDERA_CA["19"],
};
// Banderas de comunidades parecidas (números de CA_N)
const PARECIDAS_CA = [["09", "04", "10", "02"], ["13", "15", "14", "16"], ["01", "11", "17", "12"], ["03", "19", "05"], ["06", "07", "08", "18"]];
// 5.0 · Las banderas con escudo (las que más pesaban en SVG) van en WebP; las sencillas siguen en SVG, que es más ligero
const BANDERA_WEBP = ["ad", "bo", "do", "es", "gt", "hr", "ht", "me", "mt", "mx", "ni", "om", "py", "rs", "sv", "va"];
const flagSrc = id => EU ? "banderas/" + id.toLowerCase() + (BANDERA_WEBP.includes(id.toLowerCase()) ? ".webp" : ".svg") : CA ? "banderas/es/ca-" + id + ".webp" : FCA() ? "banderas/es/ca-" + CA_N[P[id][3]] + ".webp" : "banderas/es/" + id + ".webp";
const bandera = id => EU ? BANDERA[id] : CA ? BANDERA_CA[id] : FCA() ? BANDERA_CA[CA_N[P[id][3]]] : BANDERA_ES[id];
const name = id => FCA() ? P[id][3].replace("Ciudad autónoma de ", "") : P[id][0];
// Gentilicios de cada provincia (las dos de Canarias no tienen uno propio: se usa el de cada isla)
const GENT = {
  "01": "alaveses|alavenses", "02": "albaceteños", "03": "alicantinos", "04": "almerienses", "05": "abulenses", "06": "pacenses|badajocenses",
  "07": "baleares|baleáricos", "08": "barceloneses", "09": "burgaleses", "10": "cacereños", "11": "gaditanos", "12": "castellonenses",
  "13": "ciudadrealeños", "14": "cordobeses", "15": "coruñeses", "16": "conquenses", "17": "gerundenses", "18": "granadinos",
  "19": "guadalajareños|alcarreños", "20": "guipuzcoanos", "21": "onubenses", "22": "oscenses", "23": "jienenses|jiennenses", "24": "leoneses",
  "25": "leridanos|ilerdenses", "26": "riojanos", "27": "lucenses|lugueses", "28": "madrileños", "29": "malagueños", "30": "murcianos",
  "31": "navarros", "32": "orensanos|ourensanos", "33": "asturianos", "34": "palentinos", "36": "pontevedreses", "37": "salmantinos",
  "39": "cántabros", "40": "segovianos", "41": "sevillanos", "42": "sorianos", "43": "tarraconenses", "44": "turolenses",
  "45": "toledanos", "46": "valencianos", "47": "vallisoletanos", "48": "vizcaínos", "49": "zamoranos", "50": "zaragozanos",
  "51": "ceutíes", "52": "melillenses",
};
// Algunos tienen más de un gentilicio aceptado (separados por "|"): se pregunta por uno y al acertar se enseñan todos
const gents = id => ((CA ? GENT_CA : GENT)[id] || "").split("|");
const OPT_MODES = ["name", "shape", "flag"], TAP_MODES = ["find", "cap", "time", "gent", "duel"];
const ALL = Object.keys(P);
// Zona extra de cada mapa de países: la Unión Europea en Europa; los países de habla hispana en América
const EXTRA = M.extra || null;
const REGIONS = [["all", M.toda]].concat(EXTRA && EU ? [["ue", EXTRA.zona + " (" + Object.keys(P).filter(id => P[id][4]).length + ")"]] : [], 
  [...new Set(ALL.map(id => P[id][3]))]
    .filter(c => ALL.filter(id => P[id][3] === c).length > 1)
    .sort((a, b) => a.localeCompare(b, "es"))
    .map(c => [c, c + " (" + ALL.filter(id => P[id][3] === c).length + ")"]));
const ZN = r => r === "all" ? M.toda : r === "ue" ? EXTRA.zona : r;
const enZona = (id, r) => r === "all" || (r === "ue" ? !!P[id][4] : P[id][3] === r);

const $ = s => document.querySelector(s);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};


import { DUPLAS_EJEMPLO, MAX_DUPLAS } from "@/data/organizar";

/**
 * Devuelve el nombre de una dupla a partir de su id.
 * @param {string[]} duplas - Nombres de las duplas del torneo
 * @param {(number|string|null)} id - Índice de la dupla, "BYE" o null
 * @returns {string} Nombre a mostrar
 */
export const nombreDupla = (duplas, id) => {
  if (id === "BYE") return "Libre (pasa)";
  if (id == null) return "Por definir";
  return duplas[id];
};

/**
 * Indica si un partido está terminado (mejor de 3 sets: gana quien llega a 2).
 * @param {Object} partido - Partido con los sets sa y sb
 * @returns {boolean} true si el resultado es válido y definitivo
 */
export const terminado = (partido) =>
  (partido.sa === 2 && [0, 1].includes(partido.sb)) ||
  (partido.sb === 2 && [0, 1].includes(partido.sa));

/**
 * Devuelve el ganador de un partido ya terminado.
 * @param {Object} partido - Partido terminado
 * @returns {(number|string)} Id de la dupla ganadora
 */
const ganadorPorSets = (partido) =>
  partido.sa > partido.sb ? partido.a : partido.b;

/**
 * Mezcla un arreglo al azar (Fisher-Yates), modificándolo en el lugar.
 * @param {Array} lista - Arreglo a mezclar
 * @returns {Array} El mismo arreglo mezclado
 */
const mezclar = (lista) => {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
};

/**
 * Crea un partido sin resultado.
 * @param {(number|string|null)} a - Id de la dupla A
 * @param {(number|string|null)} b - Id de la dupla B
 * @param {Object} [extra={}] - Propiedades extra (fecha y grupo)
 * @returns {Object} Partido con los sets vacíos
 */
const crearPartido = (a, b, extra = {}) => ({ a, b, sa: "", sb: "", ...extra });

/**
 * Genera el fixture todos contra todos con el método del círculo.
 * @param {number[]} ids - Ids de las duplas
 * @param {number} [grupo] - Número de grupo (opcional)
 * @returns {Object[]} Lista de partidos con su fecha
 */
const todosContraTodos = (ids, grupo) => {
  const lista = ids.slice();
  if (lista.length % 2) lista.push(null);
  const n = lista.length;
  const partidos = [];

  for (let fecha = 0; fecha < n - 1; fecha++) {
    for (let i = 0; i < n / 2; i++) {
      const a = lista[i];
      const b = lista[n - 1 - i];
      if (a != null && b != null) {
        partidos.push(crearPartido(a, b, { r: fecha + 1, g: grupo }));
      }
    }
    lista.splice(1, 0, lista.pop());
  }

  return partidos;
};

/**
 * Calcula el orden estándar de un cuadro (1 vs último, 2 vs anteúltimo...).
 * @param {number} n - Tamaño del cuadro (potencia de 2)
 * @returns {number[]} Posiciones de siembra en orden
 */
const ordenSiembra = (n) => {
  let orden = [1];
  while (orden.length < n) {
    const suma = orden.length * 2 + 1;
    orden = orden.flatMap((x) => [x, suma - x]);
  }
  return orden;
};

/**
 * Devuelve el ganador de un partido de eliminación (considera los libres).
 * @param {Object} partido - Partido de eliminación
 * @returns {(number|null)} Id del ganador o null si todavía no se definió
 */
const ganador = (partido) => {
  if (partido.a === "BYE") return partido.b;
  if (partido.b === "BYE") return partido.a;
  if (partido.a == null || partido.b == null) return null;
  return terminado(partido) ? ganadorPorSets(partido) : null;
};

/**
 * Pasa los ganadores a la ronda siguiente y limpia el resultado si cambió el cruce.
 * @param {Object} ko - Cuadro de eliminación con sus rondas
 * @returns {void}
 */
const propagarGanadores = (ko) => {
  const rondas = ko.rounds;
  for (let r = 1; r < rondas.length; r++) {
    rondas[r].forEach((partido, i) => {
      const a = ganador(rondas[r - 1][2 * i]);
      const b = ganador(rondas[r - 1][2 * i + 1]);
      if (partido.a !== a || partido.b !== b) {
        Object.assign(partido, { a, b, sa: "", sb: "" });
      }
    });
  }
};

/**
 * Arma el cuadro de eliminación directa; los mejores sembrados reciben los libres.
 * @param {number[]} sembrados - Ids de las duplas ordenados por siembra
 * @returns {Object} Cuadro con sus rondas
 */
const armarCuadro = (sembrados) => {
  const n = sembrados.length;
  let tamanio = 2;
  while (tamanio < n) tamanio *= 2;

  const orden = ordenSiembra(tamanio).map((s) =>
    s <= n ? sembrados[s - 1] : "BYE",
  );
  const primeraRonda = [];
  for (let i = 0; i < tamanio; i += 2) {
    primeraRonda.push(crearPartido(orden[i], orden[i + 1]));
  }

  const rondas = [primeraRonda];
  let cantidad = tamanio / 2;
  while (cantidad > 1) {
    cantidad /= 2;
    rondas.push(
      Array.from({ length: cantidad }, () => crearPartido(null, null)),
    );
  }

  const ko = { rounds: rondas };
  propagarGanadores(ko);
  return ko;
};

/**
 * Devuelve la cantidad mínima de duplas que necesita un tipo de torneo.
 * @param {string} tipo - Tipo de torneo ("ko", "groups" o "rr")
 * @returns {number} Mínimo de duplas
 */
export const minimoDuplas = (tipo) => (tipo === "groups" ? 6 : 3);

/**
 * Valida el nombre del torneo.
 * @param {string} nombre - Nombre ingresado
 * @returns {string} Mensaje de error, o cadena vacía si es correcto
 */
export const validarNombreTorneo = (nombre) =>
  nombre.trim() ? "" : "Poné un nombre al torneo.";

/**
 * Valida el nombre de una dupla antes de agregarla.
 * @param {string} valor - Nombre ingresado
 * @param {string[]} duplas - Duplas ya cargadas
 * @returns {string} Mensaje de error, o cadena vacía si es correcto
 */
export const validarDupla = (valor, duplas) => {
  const v = valor.trim();
  const normalizar = (nombre) =>
    nombre
      .toLowerCase()
      .split("/")
      .map((j) => j.trim())
      .sort()
      .join("/");

  if (!v) return "Escribí el nombre de la dupla antes de agregarla.";
  if (duplas.length >= MAX_DUPLAS) {
    return `El torneo admite como máximo ${MAX_DUPLAS} duplas.`;
  }
  if (v.split("/").length !== 2 || v.split("/").some((j) => !j.trim())) {
    return "Ingresá dos jugadores separados por una barra (/).";
  }
  if (duplas.some((d) => normalizar(d) === normalizar(v))) {
    return `La dupla "${v}" ya fue agregada.`;
  }
  return "";
};

/**
 * Agrega las 8 duplas de ejemplo. Si alguna ya existe, usa un nombre genérico.
 * @param {string[]} duplas - Duplas ya cargadas
 * @returns {string[]} Nueva lista de duplas
 */
export const agregarEjemplo = (duplas) => {
  const nuevas = duplas.slice();

  DUPLAS_EJEMPLO.forEach((ejemplo) => {
    let dupla = ejemplo;
    let numero = nuevas.length + 1;
    while (nuevas.includes(dupla)) {
      dupla = `Jugador ${numero}A / Jugador ${numero}B`;
      numero++;
    }
    nuevas.push(dupla);
  });

  return nuevas;
};

/**
 * Crea el torneo con los datos del formulario.
 * @param {Object} datos - Nombre, descripción, lugar, sorteo, tipo y duplas
 * @returns {Object} Torneo listo para jugar
 */
export const crearTorneo = ({
  nombre,
  descripcion,
  lugar,
  sortear,
  tipo,
  duplas,
}) => {
  const n = duplas.length;
  const ids = duplas.map((_, i) => i);
  if (sortear) mezclar(ids);

  const torneo = {
    name: nombre.trim(),
    desc: descripcion,
    place: lugar.trim(),
    type: tipo,
    teams: duplas.slice(),
    matches: [],
    ko: null,
    tab: "a",
    groups: null,
  };

  if (tipo === "rr") torneo.matches = todosContraTodos(ids);

  if (tipo === "groups") {
    const cantidadGrupos = n <= 7 ? 2 : Math.ceil(n / 4);
    torneo.groups = Array.from({ length: cantidadGrupos }, () => []);
    ids.forEach((id, i) => {
      const k = i % (2 * cantidadGrupos);
      torneo.groups[k < cantidadGrupos ? k : 2 * cantidadGrupos - 1 - k].push(
        id,
      );
    });
    torneo.groups.forEach((grupo, gi) =>
      torneo.matches.push(...todosContraTodos(grupo, gi)),
    );
  }

  if (tipo === "ko") torneo.ko = armarCuadro(ids);

  return torneo;
};

/**
 * Calcula la tabla de posiciones: 3 puntos por victoria, desempate por diferencia de sets y sets ganados.
 * @param {number[]} ids - Ids de las duplas a incluir
 * @param {Object[]} partidos - Partidos a considerar
 * @returns {Object[]} Filas ordenadas con pj, g, p, sf, sc y pts
 */
export const posiciones = (ids, partidos) => {
  const filas = {};
  ids.forEach((id) => {
    filas[id] = { id, pj: 0, g: 0, p: 0, sf: 0, sc: 0, pts: 0 };
  });

  partidos.filter(terminado).forEach((partido) => {
    const A = filas[partido.a];
    const B = filas[partido.b];
    if (!A || !B) return;
    A.pj++;
    B.pj++;
    A.sf += partido.sa;
    A.sc += partido.sb;
    B.sf += partido.sb;
    B.sc += partido.sa;
    const [gano, perdio] = ganadorPorSets(partido) === partido.a ? [A, B] : [B, A];
    gano.g++;
    gano.pts += 3;
    perdio.p++;
  });

  return Object.values(filas).sort(
    (x, y) =>
      y.pts - x.pts || y.sf - y.sc - (x.sf - x.sc) || y.sf - x.sf,
  );
};

/**
 * Indica si todos los partidos del fixture están terminados.
 * @param {Object} torneo - Torneo actual
 * @returns {boolean} true si no queda ningún partido pendiente
 */
export const todosTerminados = (torneo) => torneo.matches.every(terminado);

/**
 * Genera la fase final de eliminación con los clasificados de cada grupo.
 * @param {Object} torneo - Torneo con la fase de grupos terminada
 * @returns {Object} Nuevo torneo con el cuadro de la fase final
 */
export const iniciarFaseFinal = (torneo) => {
  const tablas = torneo.groups.map((grupo) =>
    posiciones(
      grupo,
      torneo.matches.filter((m) => grupo.includes(m.a)),
    ),
  );
  const primeros = tablas.map((t) => t[0].id);
  const segundos = tablas.map((t) => t[1].id);
  if (segundos.length % 2) segundos.push(segundos.shift());

  return {
    ...torneo,
    ko: armarCuadro(primeros.concat(segundos)),
    tab: "b",
  };
};

/**
 * Determina el campeón del torneo si ya terminó.
 * @param {Object} torneo - Torneo actual
 * @returns {(number|null)} Id de la dupla campeona o null
 */
export const campeon = (torneo) => {
  if (torneo.type === "rr") {
    return todosTerminados(torneo)
      ? posiciones(
          torneo.teams.map((_, i) => i),
          torneo.matches,
        )[0].id
      : null;
  }
  return torneo.ko ? ganador(torneo.ko.rounds.at(-1)[0]) : null;
};

/**
 * Reúne todos los partidos ya jugados (fixture y eliminación).
 * @param {Object} torneo - Torneo actual
 * @returns {Object[]} Partidos terminados
 */
export const jugados = (torneo) =>
  [...torneo.matches, ...(torneo.ko ? torneo.ko.rounds.flat() : [])].filter(
    (m) => m.a !== "BYE" && m.b !== "BYE" && terminado(m),
  );

/**
 * Calcula la cantidad total de partidos que tendrá el torneo.
 * @param {Object} torneo - Torneo actual
 * @returns {number} Total de partidos
 */
export const totalPartidos = (torneo) => {
  let total = torneo.matches.length;
  if (torneo.ko) {
    total += torneo.ko.rounds
      .flat()
      .filter((m) => m.a !== "BYE" && m.b !== "BYE").length;
  }
  if (torneo.type === "groups" && !torneo.ko) {
    total += 2 * torneo.groups.length - 1;
  }
  return total;
};

/**
 * Obtiene un partido a partir de su referencia ("m,i" para fixture o "k,ronda,i" para eliminación).
 * @param {Object} torneo - Torneo actual
 * @param {string} referencia - Referencia del partido
 * @returns {Object} El partido
 */
const obtenerPartido = (torneo, referencia) => {
  const partes = referencia.split(",");
  return partes[0] === "m"
    ? torneo.matches[partes[1]]
    : torneo.ko.rounds[partes[1]][partes[2]];
};

/**
 * Comprueba un resultado de sets (mejor de 3: de 0 a 2 por dupla y máximo 3 sets en total).
 * @param {(number|string)} sets - Sets ingresados ("" si el campo está vacío)
 * @param {(number|string)} rival - Sets de la otra dupla
 * @returns {string} Mensaje de error, o cadena vacía si el valor es correcto
 */
const validarSet = (sets, rival) => {
  if (sets !== "" && !(Number.isInteger(sets) && sets >= 0 && sets <= 2)) {
    return "Ingresá un número entero de sets entre 0 y 2 (mejor de 3).";
  }
  if (sets !== "" && rival !== "" && sets + rival > 3) {
    return `Máximo 3 sets en total: ${sets}-${rival} no es posible.`;
  }
  return "";
};

/**
 * Carga los sets de una dupla en un partido. Si el valor es inválido lo deja vacío.
 * @param {Object} torneo - Torneo actual
 * @param {string} referencia - Referencia del partido
 * @param {string} clave - "sa" o "sb" según la dupla
 * @param {string} valor - Valor escrito en el input
 * @returns {{torneo: Object, error: string}} Nuevo torneo y mensaje de error
 */
export const cargarSet = (torneo, referencia, clave, valor) => {
  const nuevo = structuredClone(torneo);
  const partido = obtenerPartido(nuevo, referencia);
  const sets = valor === "" ? "" : Number(valor);
  const error = validarSet(sets, partido[clave === "sa" ? "sb" : "sa"]);

  partido[clave] = error ? "" : sets;
  if (referencia[0] === "k") propagarGanadores(nuevo.ko);

  if (campeon(nuevo) != null && !nuevo.fin) {
    nuevo.fin = true;
    nuevo.tab = "z";
  }

  return { torneo: nuevo, error };
};

/**
 * Arma la dirección del mapa de Google Maps para mostrar en un iframe.
 * @param {string} lugar - Lugar del torneo
 * @returns {string} URL del mapa embebido
 */
export const urlMapa = (lugar) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(lugar)}&output=embed`;

/**
 * Arma la dirección para abrir el lugar en Google Maps.
 * @param {string} lugar - Lugar del torneo
 * @returns {string} URL de búsqueda en Google Maps
 */
export const urlBusquedaMapa = (lugar) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar)}`;
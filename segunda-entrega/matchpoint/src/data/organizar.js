/**
 * Cantidad máxima de duplas permitidas en un torneo.
 * @constant {number}
 */
export const MAX_DUPLAS = 16;

/**
 * Duplas que se cargan con el botón "Cargar 8 duplas de ejemplo".
 * @constant {string[]}
 */
export const DUPLAS_EJEMPLO = [
  "Gómez / Pérez",
  "Lugano / Díaz",
  "Fernández / Ruiz",
  "Sosa / Molina",
  "Navarro / Gil",
  "Castro / Vega",
  "Ortiz / Rey",
  "Silva / Luna",
];

/**
 * Tipos de torneo que se pueden elegir en el formulario.
 * @constant {Object[]}
 */
export const TIPOS_TORNEO = [
  {
    tipo: "ko",
    titulo: "Eliminación directa",
    descripcion: "Perdés y quedás afuera.",
  },
  {
    tipo: "groups",
    titulo: "Fase de grupos + final",
    descripcion:
      "Grupos todos contra todos; clasifican 2 por grupo a eliminación directa.",
  },
  {
    tipo: "rr",
    titulo: "Todos contra todos",
    descripcion: "Todas las duplas se enfrentan. Gana quien suma más puntos.",
  },
];

/**
 * Pestañas del torneo y su texto según el tipo de torneo.
 * Si un tipo no tiene texto, la pestaña no se muestra.
 * @constant {Object[]}
 */
export const PESTANIAS = [
  { id: "a", texto: { ko: "Cuadro", rr: "Partidos", groups: "Grupos" } },
  { id: "b", texto: { rr: "Posiciones", groups: "Fase final" } },
  { id: "z", texto: { ko: "Análisis", rr: "Análisis", groups: "Análisis" } },
];

/**
 * Nombre de cada ronda del cuadro según cuántas rondas faltan para terminar.
 * @constant {Object<number, string>}
 */
export const NOMBRES_RONDAS = {
  1: "Final",
  2: "Semifinales",
  3: "Cuartos de final",
  4: "Octavos de final",
};
/**
 * Devuelve la clase CSS que define el color de la etiqueta según el nivel del torneo.
 * @method obtenerClaseNivel
 * @param {string} nivel - Nivel del torneo
 * @return {string} Clase CSS del nivel
 */
export const obtenerClaseNivel = (nivel) => {
  if (nivel === "Avanzado") return "level-orange";
  if (nivel === "Intermedio") return "level-blue";
  return "level-green";
};
/**
 * Da formato de pesos argentinos a un precio.
 * @param {number} precio - Precio a mostrar
 * @returns {string} Precio con formato, por ejemplo "$30.000"
 */
export const formatearPrecio = (precio) =>
  precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
  
/**
 * Da formato de pesos argentinos a un precio.
 * @method formatearPrecio
 * @param {number} precio - Precio a mostrar
 * @return {string} Precio con formato, por ejemplo "$30.000"
 */
export const formatearPrecio = (precio) =>
  precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

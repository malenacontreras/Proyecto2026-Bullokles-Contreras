const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Obtiene todos los torneos del mock (json-server).
 * @return {Promise<Array>} Lista de torneos.
 */
export const getTorneos = async () => {
  const response = await fetch(`${BASE_URL}torneos`);

  if (!response.ok) {
    throw new Error("Error al obtener los torneos");
  }

  return await response.json();
};
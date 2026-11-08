import { useState, useEffect } from "react";
import TorneoCard from "@/components/TorneoCard";
import { getTorneos } from "@/api/torneos";
import { obtenerClaseNivel } from "@/utils/niveles";
import { formatearPrecio } from "@/utils/formato";
import Button from "@/components/Button";

/**
 * Página de torneos: lista los torneos del mock con buscador, filtros y detalles.
 * @method Torneos
 * @return {JSX.Element} Página de torneos
 */
const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [busqueda, setBusqueda] = useState(
    () => localStorage.getItem("matchpoint-busqueda") || "",
  );

  const [mes, setMes] = useState(
    () => localStorage.getItem("matchpoint-mes") || "",
  );

  const [nivel, setNivel] = useState(
    () => localStorage.getItem("matchpoint-nivel") || "",
  );

  const [ubicacion, setUbicacion] = useState(
    () => localStorage.getItem("matchpoint-ubicacion") || "",
  );

  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

  useEffect(() => {
    /**
     * Trae los torneos del mock y avisa si no se pudieron cargar.
     * @method cargarTorneos
     * @return {Promise<void>}
     */
    const cargarTorneos = async () => {
      try {
        const datos = await getTorneos();
        setTorneos(datos);
      } catch {
        setErrorCarga(
          "Verificá que el mock de servicios esté funcionando (npm run services).",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarTorneos();
  }, []);

  useEffect(() => {
    localStorage.setItem("matchpoint-busqueda", busqueda);
    localStorage.setItem("matchpoint-mes", mes);
    localStorage.setItem("matchpoint-nivel", nivel);
    localStorage.setItem("matchpoint-ubicacion", ubicacion);
  }, [busqueda, mes, nivel, ubicacion]);

  const torneosFiltrados = torneos.filter((torneo) => {
    const coincideBusqueda = torneo.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    const coincideMes = !mes || torneo.mes === mes;
    const coincideNivel =
      !nivel ||
      torneo.categoria === nivel ||
      torneo.categoria === "Todos los niveles";
    const coincideUbicacion = !ubicacion || torneo.ubicacion === ubicacion;

    return (
      coincideBusqueda && coincideMes && coincideNivel && coincideUbicacion
    );
  });

  /**
   * Vuelve todos los filtros a su valor inicial.
   * @method limpiarFiltros
   * @return {void}
   */
  const limpiarFiltros = () => {
    setBusqueda("");
    setMes("");
    setNivel("");
    setUbicacion("");
  };

  return (
    <section className="page-shell">
      <div className="page-head">
        <div className="eyebrow">Calendario abierto</div>
        <h2 className="page-title">Torneos</h2>
        <p>
          Explorá los torneos publicados y hacé clic en uno para ver sus
          detalles.
        </p>
      </div>

      <div className="filter-bar">
        <label className="visually-hidden" htmlFor="buscador">
          Buscar torneo
        </label>

        <input
          type="search"
          className="search"
          id="buscador"
          placeholder="Buscar torneo..."
          maxLength={60}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <label className="visually-hidden" htmlFor="filtro-fecha">
          Filtrar por mes
        </label>
        <input
          type="month"
          id="filtro-fecha"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />

        <label className="visually-hidden" htmlFor="filtro-nivel">
          Filtrar por nivel
        </label>
        <select
          id="filtro-nivel"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
        >
          <option value="" disabled hidden>
            Nivel
          </option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>

        <label className="visually-hidden" htmlFor="filtro-ubicacion">
          Filtrar por ubicación
        </label>
        <select
          id="filtro-ubicacion"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        >
          <option value="">Ubicación</option>
          <option value="Córdoba">Córdoba</option>
          <option value="Buenos Aires">Buenos Aires</option>
          <option value="Rosario">Rosario</option>
          <option value="Santa Fe">Santa Fe</option>
        </select>

        <Button className="btn-limpiar" onClick={limpiarFiltros}>
          Limpiar
        </Button>
      </div>

      <div className="cards-grid">
        {cargando && (
          <div className="sin-resultados">
            <p>Cargando torneos...</p>
          </div>
        )}

        {!cargando && errorCarga && (
          <div className="sin-resultados" role="alert">
            <h3>No se pudieron cargar los torneos</h3>
            <p>{errorCarga}</p>
          </div>
        )}

        {!cargando && !errorCarga && torneosFiltrados.length === 0 && (
          <div className="sin-resultados">
            <h3>No se encontraron torneos</h3>
            <p>
              Probá ajustando los filtros de búsqueda para ver más resultados.
            </p>
          </div>
        )}

        {torneosFiltrados.map((torneo) => (
          <TorneoCard
            key={torneo.id}
            torneo={torneo}
            onSeleccionar={setTorneoSeleccionado}
          />
        ))}
      </div>

      {torneoSeleccionado && (
        <div
          id="overlay"
          className="show"
          onClick={() => setTorneoSeleccionado(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${torneoSeleccionado.nombre}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="modal-close"
              onClick={() => setTorneoSeleccionado(null)}
              ariaLabel="Cerrar detalles"
            >
              ✕
            </Button>

            <img
              className="modal-img"
              src={torneoSeleccionado.imagen}
              alt={torneoSeleccionado.alt}
            />

            <div className="modal-body">
              <span
                className={`level ${obtenerClaseNivel(torneoSeleccionado.categoria)}`}
              >
                {torneoSeleccionado.categoria}
              </span>

              <h2>{torneoSeleccionado.nombre}</h2>

              <p>{torneoSeleccionado.description}</p>

              <div className="meta-list">
                <span className="meta-item">📅 {torneoSeleccionado.fecha}</span>

                <span className="meta-item">
                  📍 {torneoSeleccionado.ubicacion}
                </span>

                <span className="meta-item">
                  👥 {torneoSeleccionado.jugadores}
                </span>

                <span className="meta-item">
                  💰 {formatearPrecio(torneoSeleccionado.precio)} por dupla
                </span>
              </div>

              <a
                href={torneoSeleccionado.web}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver ubicación en Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Torneos;
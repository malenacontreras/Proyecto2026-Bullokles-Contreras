import { useState, useEffect } from "react";
import TorneoCard from "@/components/TorneoCard";
import { getTorneos } from "@/api/torneos";
import { obtenerClaseNivel } from "@/utils/niveles";

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);

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
    const cargarTorneos = async () => {
      try {
        const datos = await getTorneos();
        setTorneos(datos);
      } catch (error) {
        console.error("Error al cargar los torneos:", error);
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
    const coincideNivel = !nivel || torneo.nivel === nivel;
    const coincideUbicacion = !ubicacion || torneo.ubicacion === ubicacion;

    return (
      coincideBusqueda && coincideMes && coincideNivel && coincideUbicacion
    );
  });

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
        <p className="page-subtitle">
          Explorá los torneos publicados y hacé click en uno para ver sus
          detalles.
        </p>
      </div>

      <div className="filter-bar">
        <label className="visually-hidden" htmlFor="buscador">
          Buscar torneo
        </label>
        <input
          className="search"
          id="buscador"
          placeholder="Buscar torneo..."
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
          <option value="">Nivel</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
          <option value="Todos los niveles">Todos los niveles</option>
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

        <button type="button" className="btn-limpiar" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <div className="cards-grid" id="tournament-grid">
        {torneosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <h3>No se encontraron torneos</h3>
            <p>
              Probá ajustando los filtros de búsqueda para ver más resultados.
            </p>
          </div>
        ) : (
          torneosFiltrados.map((torneo) => (
            <TorneoCard
              key={torneo.id}
              torneo={torneo}
              onSeleccionar={setTorneoSeleccionado}
            />
          ))
        )}
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
            <button
              type="button"
              className="modal-close"
              onClick={() => setTorneoSeleccionado(null)}
              aria-label="Cerrar detalles"
            >
              ✕
            </button>

            <img
              className="modal-img"
              src={torneoSeleccionado.imagen}
              alt={torneoSeleccionado.alt}
            />

            <div className="modal-body">
              <span
                className={`level ${obtenerClaseNivel(torneoSeleccionado.nivel)}`}
              >
                {torneoSeleccionado.nivel}
              </span>

              <h2>{torneoSeleccionado.nombre}</h2>

              <p>{torneoSeleccionado.descripcion}</p>

              <div className="meta-list">
                <span className="meta-item">📅 {torneoSeleccionado.fecha}</span>

                <span className="meta-item">
                  📍 {torneoSeleccionado.ubicacion}
                </span>

                <span className="meta-item">
                  👥 {torneoSeleccionado.jugadores}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Torneos;

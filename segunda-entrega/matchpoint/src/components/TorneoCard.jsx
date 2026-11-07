import { obtenerClaseNivel } from "@/utils/niveles";

/**
 * Tarjeta de un torneo de la lista. Al hacer click (o Enter) muestra sus detalles.
 * @method TorneoCard
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo a mostrar
 * @param {Function} props.onSeleccionar - Recibe el torneo elegido
 * @return {JSX.Element} Tarjeta del torneo
 */
const TorneoCard = ({ torneo, onSeleccionar }) => {
  /**
   * Abre los detalles del torneo con el teclado (Enter o espacio).
   * @method seleccionarConTeclado
   * @param {KeyboardEvent} e - Evento del teclado
   * @return {void}
   */
  const seleccionarConTeclado = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSeleccionar(torneo);
    }
  };

  return (
    <article
      className="tournament-card"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${torneo.nombre}`}
      onClick={() => onSeleccionar(torneo)}
      onKeyDown={seleccionarConTeclado}
    >
      <img className="card-image" src={torneo.imagen} alt={torneo.alt} />

      <div className="card-body">
        <h3>{torneo.nombre}</h3>

        <div className="meta-list">
          <span className="meta-item">{torneo.fecha}</span>
          <span className="meta-item">{torneo.ubicacion}</span>
          <span className="meta-item">{torneo.jugadores}</span>
        </div>

        <span className={`level ${obtenerClaseNivel(torneo.categoria)}`}>
          {torneo.categoria}
        </span>
      </div>
    </article>
  );
};

export default TorneoCard;
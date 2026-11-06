const TorneoCard = ({ torneo, onSeleccionar }) => {
  return (
    <article className="tournament-card" onClick={() => onSeleccionar(torneo)}>
      <img className="card-image" src={torneo.imagen} alt={torneo.alt} />

      <div className="card-body">
        <h3>{torneo.nombre}</h3>

        <div className="meta-list">
          <span className="meta-item">{torneo.fecha}</span>
          <span className="meta-item">{torneo.ubicacion}</span>
          <span className="meta-item">{torneo.jugadores}</span>
        </div>

        <span
          className={`level ${
            torneo.nivel === "Avanzado"
              ? "level-orange"
              : torneo.nivel === "Intermedio"
                ? "level-blue"
                : "level-green"
          }`}
        >
          {torneo.nivel}
        </span>
      </div>
    </article>
  );
};

export default TorneoCard;

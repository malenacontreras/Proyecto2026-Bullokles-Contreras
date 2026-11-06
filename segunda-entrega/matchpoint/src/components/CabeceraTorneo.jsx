import Button from "@/components/Button";
import { TIPOS_TORNEO } from "@/data/organizar";
import {
  campeon,
  jugados,
  totalPartidos,
  urlBusquedaMapa,
  urlMapa,
} from "@/utils/torneo";

/**
 * Cabecera del torneo: nombre, tipo, descripción, mapa y progreso.
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo actual
 * @param {Function} props.onNuevoTorneo - Descarta el torneo para crear otro
 * @returns {JSX.Element} Cabecera del torneo
 */
const CabeceraTorneo = ({ torneo, onNuevoTorneo }) => {
  const cantidadJugados = jugados(torneo).length;
  const total = totalPartidos(torneo);
  const progreso = Math.min(100, Math.round((100 * cantidadJugados) / total));
  const tipo = TIPOS_TORNEO.find((t) => t.tipo === torneo.type);

  return (
    <section className="card court">
      <div className="row between flexwrap">
        <div>
          <h2>{torneo.name}</h2>
          <div className="sub">
            {tipo.titulo} · {torneo.teams.length} duplas
          </div>
        </div>
        <Button className="ghost" onClick={onNuevoTorneo}>
          Nuevo torneo
        </Button>
      </div>
      {torneo.desc && <p>{torneo.desc}</p>}
      {torneo.place && (
        <>
          <div className="sub">
            📍 {torneo.place} ·{" "}
            <a
              href={urlBusquedaMapa(torneo.place)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en Google Maps ↗
            </a>
          </div>
          <iframe
            src={urlMapa(torneo.place)}
            loading="lazy"
            title="Mapa del lugar"
          ></iframe>
        </>
      )}
      <div className="bar">
        <i style={{ width: `${progreso}%` }}></i>
      </div>
      <div className="sub mts">
        <span>
          {cantidadJugados} de {total} partidos
        </span>
        {campeon(torneo) != null && <span> · ¡Torneo finalizado!</span>}
      </div>
    </section>
  );
};

export default CabeceraTorneo;
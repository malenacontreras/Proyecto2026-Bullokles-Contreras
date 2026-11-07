import PartidoCard from "@/components/PartidoCard";
import { NOMBRES_RONDAS } from "@/data/organizar";

/**
 * Cuadro de eliminación directa, con una columna por ronda.
 * @method Cuadro
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo actual
 * @param {Object<string, string>} props.errores - Errores de sets por partido
 * @param {Function} props.onCargarSet - Función para cargar los sets
 * @return {JSX.Element} Cuadro del torneo
 */
const Cuadro = ({ torneo, errores, onCargarSet }) => {
  const rondas = torneo.ko.rounds;

  return (
    <div className="bracket">
      {rondas.map((partidos, r) => (
        <div className="col" key={r}>
          <h3>{NOMBRES_RONDAS[rondas.length - r] || `Ronda ${r + 1}`}</h3>
          <div>
            {partidos.map((partido, i) => (
              <PartidoCard
                key={i}
                partido={partido}
                referencia={`k,${r},${i}`}
                etiqueta={`Partido ${i + 1}`}
                duplas={torneo.teams}
                error={errores[`k,${r},${i}`]}
                onCargarSet={onCargarSet}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cuadro;
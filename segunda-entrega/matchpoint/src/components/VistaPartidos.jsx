import Cuadro from "@/components/Cuadro";
import PartidoCard from "@/components/PartidoCard";
import TablaPosiciones from "@/components/TablaPosiciones";

/**
 * Primera pestaña del torneo: cuadro, fechas o grupos según el tipo.
 * @method VistaPartidos
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo actual
 * @param {Object<string, string>} props.errores - Errores de sets por partido
 * @param {Function} props.onCargarSet - Función para cargar los sets
 * @return {JSX.Element} Partidos del torneo
 */
const VistaPartidos = ({ torneo, errores, onCargarSet }) => {
  if (torneo.type === "ko") {
    return (
      <Cuadro torneo={torneo} errores={errores} onCargarSet={onCargarSet} />
    );
  }

  if (torneo.type === "rr") {
    const fechas = [...new Set(torneo.matches.map((m) => m.r))];
    return (
      <div className="two">
        {fechas.map((fecha) => (
          <div key={fecha}>
            <h3>Fecha {fecha}</h3>
            <div>
              {torneo.matches.map(
                (partido, i) =>
                  partido.r === fecha && (
                    <PartidoCard
                      key={i}
                      partido={partido}
                      referencia={`m,${i}`}
                      duplas={torneo.teams}
                      error={errores[`m,${i}`]}
                      onCargarSet={onCargarSet}
                    />
                  ),
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {torneo.groups.map((grupo, gi) => (
        <section className="card" key={gi}>
          <h3>Grupo {String.fromCharCode(65 + gi)}</h3>
          <TablaPosiciones
            ids={grupo}
            partidos={torneo.matches.filter((m) => m.g === gi)}
            clasificados={2}
            duplas={torneo.teams}
          />
          <div className="two mt">
            {torneo.matches.map(
              (partido, i) =>
                partido.g === gi && (
                  <PartidoCard
                    key={i}
                    partido={partido}
                    referencia={`m,${i}`}
                    etiqueta={`Fecha ${partido.r}`}
                    duplas={torneo.teams}
                    error={errores[`m,${i}`]}
                    onCargarSet={onCargarSet}
                  />
                ),
            )}
          </div>
        </section>
      ))}
    </>
  );
};

export default VistaPartidos;
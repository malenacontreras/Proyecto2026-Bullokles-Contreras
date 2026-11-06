import Button from "@/components/Button";
import Cuadro from "@/components/Cuadro";
import TablaPosiciones from "@/components/TablaPosiciones";
import { todosTerminados } from "@/utils/torneo";

/**
 * Segunda pestaña del torneo: posiciones (todos contra todos) o fase final (grupos).
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo actual
 * @param {Object<string, string>} props.errores - Errores de sets por partido
 * @param {Function} props.onCargarSet - Función para cargar los sets
 * @param {Function} props.onIniciarFaseFinal - Genera la fase final
 * @returns {JSX.Element} Posiciones o fase final
 */
const VistaSegunda = ({ torneo, errores, onCargarSet, onIniciarFaseFinal }) => {
  if (torneo.type === "rr") {
    return (
      <section className="card">
        <TablaPosiciones
          ids={torneo.teams.map((_, i) => i)}
          partidos={torneo.matches}
          clasificados={1}
          duplas={torneo.teams}
        />
        <p className="sub">
          3 puntos por victoria. Desempate: diferencia de sets y luego sets
          ganados.
        </p>
      </section>
    );
  }

  if (torneo.ko) {
    return (
      <Cuadro torneo={torneo} errores={errores} onCargarSet={onCargarSet} />
    );
  }

  const completa = todosTerminados(torneo);

  return (
    <section className="card">
      <p>
        Clasifican los 2 primeros de cada grupo.{" "}
        {completa ? (
          <span>¡Fase de grupos completa!</span>
        ) : (
          <span>Cargá todos los resultados de grupos para continuar.</span>
        )}
      </p>
      <Button onClick={onIniciarFaseFinal} disabled={!completa}>
        Generar fase final →
      </Button>
    </section>
  );
};

export default VistaSegunda;
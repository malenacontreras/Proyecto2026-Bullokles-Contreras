import { useEffect, useState } from "react";
import Analisis from "@/components/Analisis";
import Button from "@/components/Button";
import CabeceraTorneo from "@/components/CabeceraTorneo";
import FormularioTorneo from "@/components/FormularioTorneo";
import VistaPartidos from "@/components/VistaPartidos";
import VistaSegunda from "@/components/VistaSegunda";
import { PESTANIAS } from "@/data/organizar";
import { cargarSet, iniciarFaseFinal } from "@/utils/torneo";

const CLAVE_TORNEO = "matchpoint-torneo";
/**
 * Página para organizar un torneo: muestra el formulario o el torneo en curso.
 * @method Organizar
 * @return {JSX.Element} Página de organizar torneo
 */
const Organizar = () => {
  const [torneo, setTorneo] = useState(() =>
    JSON.parse(localStorage.getItem(CLAVE_TORNEO)),
  );
  const [erroresSets, setErroresSets] = useState({});

  useEffect(() => {
    document.title = "MatchPoint | Organizar torneo";
  }, []);

  useEffect(() => {
    if (torneo) {
      localStorage.setItem(CLAVE_TORNEO, JSON.stringify(torneo));
    } else {
      localStorage.removeItem(CLAVE_TORNEO);
    }
  }, [torneo]);

  /**
   * Carga los sets de un partido. Si el valor es inválido avisa con alert y blanquea el campo.
   * @method actualizarSet
   * @param {string} referencia - Referencia del partido
   * @param {string} clave - "sa" o "sb" según la dupla
   * @param {string} valor - Valor escrito en el input
   * @return {void}
   */
  const actualizarSet = (referencia, clave, valor) => {
    const resultado = cargarSet(torneo, referencia, clave, valor);

    if (resultado.error) {
      window.alert(resultado.error);
    }

    setTorneo(resultado.torneo);
    setErroresSets({ ...erroresSets, [referencia]: resultado.error });
  };

  /**
   * Descarta el torneo actual (con confirmación) y vuelve al formulario.
   * @method nuevoTorneo
   * @return {void}
   */
  const nuevoTorneo = () => {
    if (!window.confirm("¿Descartar este torneo y crear uno nuevo?")) return;
    setTorneo(null);
    setErroresSets({});
  };

  if (!torneo) {
    return (
      <div className="wrap">
        <FormularioTorneo onCrear={setTorneo} />
      </div>
    );
  }

  return (
    <div className="wrap">
      <CabeceraTorneo torneo={torneo} onNuevoTorneo={nuevoTorneo} />

      <nav className="tabs" aria-label="Secciones del torneo">
        {PESTANIAS.filter((p) => p.texto[torneo.type]).map((p) => (
          <Button
            key={p.id}
            className={torneo.tab === p.id ? "on" : undefined}
            onClick={() => setTorneo({ ...torneo, tab: p.id })}
          >
            {p.texto[torneo.type]}
          </Button>
        ))}
      </nav>

      {torneo.tab === "a" && (
        <VistaPartidos
          torneo={torneo}
          errores={erroresSets}
          onCargarSet={actualizarSet}
        />
      )}
      {torneo.tab === "b" && (
        <VistaSegunda
          torneo={torneo}
          errores={erroresSets}
          onCargarSet={actualizarSet}
          onIniciarFaseFinal={() => setTorneo(iniciarFaseFinal(torneo))}
        />
      )}
      {torneo.tab === "z" && <Analisis torneo={torneo} />}
    </div>
  );
};

export default Organizar;
import TablaPosiciones from "@/components/TablaPosiciones";
import { campeon, jugados, nombreDupla, posiciones } from "@/utils/torneo";

/**
 * Análisis del torneo terminado (o un aviso si todavía no terminó).
 * @method Analisis
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.torneo - Torneo actual
 * @return {JSX.Element} Análisis del torneo
 */
const Analisis = ({ torneo }) => {
  const idCampeon = campeon(torneo);

  if (idCampeon == null) {
    return (
      <section className="card">
        <h3>📊 Análisis</h3>
        <p className="sub">
          El análisis aparecerá cuando termine el torneo. ¡Seguí cargando
          resultados!
        </p>
      </section>
    );
  }

  const partidos = jugados(torneo);
  const ids = torneo.teams.map((_, i) => i);
  const tabla = posiciones(ids, partidos);
  const datosCampeon = tabla.find((fila) => fila.id === idCampeon);
  const final = torneo.ko && torneo.ko.rounds.at(-1)[0];
  const idSubcampeon =
    torneo.type === "rr"
      ? tabla[1].id
      : final.a === idCampeon
        ? final.b
        : final.a;
  const nombreCampeon = nombreDupla(torneo.teams, idCampeon);
  const nombreSubcampeon = nombreDupla(torneo.teams, idSubcampeon);
  const estadisticas = [
    ["Duplas participantes", torneo.teams.length],
    ["Partidos jugados", partidos.length],
    [
      "Partidos definidos en 3 sets",
      partidos.filter((m) => m.sa + m.sb === 3).length,
    ],
    [
      "Efectividad del campeón",
      Math.round((100 * datosCampeon.g) / datosCampeon.pj) + "%",
    ],
  ];

  return (
    <div>
      <section className="card court champ">
        <div className="cup">🏆</div>
        <div className="sub">CAMPEONES DE {torneo.name.toUpperCase()}</div>
        <h2>{nombreCampeon}</h2>
        <p>Subcampeón: {nombreSubcampeon}</p>
      </section>
      <section className="card">
        <h3>Resumen del torneo</h3>
        <p>
          ¡{nombreCampeon} es el campeón de {torneo.name}! Ganó{" "}
          {datosCampeon.g} de sus {datosCampeon.pj} partidos, con{" "}
          {datosCampeon.sf} sets a favor y {datosCampeon.sc} en contra. El
          subcampeón fue {nombreSubcampeon}.
        </p>
        <div className="stats">
          {estadisticas.map(([texto, valor]) => (
            <div className="stat" key={texto}>
              <span>{texto}</span>
              <b>{valor}</b>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Ranking general</h3>
        <TablaPosiciones
          ids={ids}
          partidos={partidos}
          clasificados={1}
          duplas={torneo.teams}
        />
      </section>
    </div>
  );
};

export default Analisis;
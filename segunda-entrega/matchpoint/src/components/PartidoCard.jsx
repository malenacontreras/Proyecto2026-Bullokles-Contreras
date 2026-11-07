import { nombreDupla, terminado } from "@/utils/torneo";

/**
 * Tarjeta de un partido con los inputs para cargar los sets (o el aviso de pase libre).
 * @method PartidoCard
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.partido - Partido a mostrar
 * @param {string} props.referencia - Referencia del partido ("m,i" o "k,ronda,i")
 * @param {string} [props.etiqueta] - Texto que se muestra arriba de la tarjeta
 * @param {string[]} props.duplas - Nombres de las duplas del torneo
 * @param {string} [props.error] - Mensaje de error del último set cargado
 * @param {Function} props.onCargarSet - Recibe la referencia, la clave del set y el valor
 * @return {JSX.Element} Tarjeta del partido
 */
const PartidoCard = ({
  partido,
  referencia,
  etiqueta = "",
  duplas,
  error,
  onCargarSet,
}) => {
  if (partido.a === "BYE" || partido.b === "BYE") {
    const pasa = partido.a === "BYE" ? partido.b : partido.a;
    return (
      <div className="m">
        <small>{etiqueta}</small>
        <div className="bye">{nombreDupla(duplas, pasa)} pasa directo</div>
      </div>
    );
  }

  const fin = terminado(partido);
  const deshabilitado = partido.a == null || partido.b == null;
  const incompleto = partido.sa !== "" && partido.sb !== "" && !fin;
  const mensaje =
    error ||
    (incompleto
      ? "Resultado incompleto: gana la dupla que llega a 2 sets."
      : "");
  const idBase = `sets-${referencia.replaceAll(",", "-")}`;
  const lados = [
    { lado: "a", propio: "sa", rival: "sb", id: partido.a },
    { lado: "b", propio: "sb", rival: "sa", id: partido.b },
  ];

  return (
    <div className={fin ? "m done" : "m"}>
      <small>{etiqueta}</small>
      <div className="hd">
        <span></span>
        <span>Sets</span>
      </div>
      {lados.map(({ lado, propio, rival, id }) => (
        <div
          key={lado}
          className={fin && partido[propio] > partido[rival] ? "tr w" : "tr"}
        >
          <span className="n">{nombreDupla(duplas, id)}</span>
          <label htmlFor={`${idBase}-${lado}`} className="visually-hidden">
            Sets de {nombreDupla(duplas, id)}
          </label>
          <input
            id={`${idBase}-${lado}`}
            className="sc"
            type="number"
            min="0"
            max="2"
            inputMode="numeric"
            value={partido[propio]}
            disabled={deshabilitado}
            aria-invalid={Boolean(error)}
            aria-describedby={mensaje ? `${idBase}-ayuda` : undefined}
            onChange={(e) => onCargarSet(referencia, propio, e.target.value)}
          />
        </div>
      ))}
      {mensaje && (
        <small className="hint" id={`${idBase}-ayuda`} role="alert">
          {mensaje}
        </small>
      )}
    </div>
  );
};

export default PartidoCard;
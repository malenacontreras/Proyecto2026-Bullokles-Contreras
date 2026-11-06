import { nombreDupla, posiciones } from "@/utils/torneo";

/**
 * Tabla de posiciones de un grupo de duplas.
 * @param {Object} props - Propiedades del componente
 * @param {number[]} props.ids - Ids de las duplas a mostrar
 * @param {Object[]} props.partidos - Partidos que se tienen en cuenta
 * @param {number} props.clasificados - Cantidad de posiciones que se resaltan
 * @param {string[]} props.duplas - Nombres de las duplas del torneo
 * @returns {JSX.Element} Tabla de posiciones
 */
const TablaPosiciones = ({ ids, partidos, clasificados, duplas }) => {
  return (
    <div className="tw">
      <table>
        <caption className="sr-only">Tabla de posiciones del torneo</caption>
        <thead>
          <tr>
            <th>#</th>
            <th className="l">Dupla</th>
            <th>PJ</th>
            <th>G</th>
            <th>P</th>
            <th>Sets</th>
            <th>Dif.</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {posiciones(ids, partidos).map((fila, i) => {
            const diferencia = fila.sf - fila.sc;
            return (
              <tr key={fila.id} className={i < clasificados ? "q" : undefined}>
                <td>{i + 1}</td>
                <td className="l">{nombreDupla(duplas, fila.id)}</td>
                <td>{fila.pj}</td>
                <td>{fila.g}</td>
                <td>{fila.p}</td>
                <td>
                  {fila.sf}-{fila.sc}
                </td>
                <td>{(diferencia > 0 ? "+" : "") + diferencia}</td>
                <td>
                  <b>{fila.pts}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPosiciones;
import { useState } from "react";
import Button from "@/components/Button";
import { DUPLAS_EJEMPLO, MAX_DUPLAS, TIPOS_TORNEO } from "@/data/organizar";
import {
  agregarEjemplo,
  crearTorneo,
  minimoDuplas,
  urlBusquedaMapa,
  urlMapa,
  validarDupla,
  validarNombreTorneo,
} from "@/utils/torneo";

/**
 * Formulario para crear un torneo nuevo, con validaciones en tiempo real.
 * @method FormularioTorneo
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onCrear - Recibe el torneo creado
 * @return {JSX.Element} Formulario del torneo
 */
const FormularioTorneo = ({ onCrear }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [lugarMapa, setLugarMapa] = useState("");
  const [sortear, setSortear] = useState(true);
  const [tipo, setTipo] = useState("ko");
  const [duplas, setDuplas] = useState([]);
  const [dupla, setDupla] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorDupla, setErrorDupla] = useState("");
  const [intentoCrear, setIntentoCrear] = useState(false);

  const minimo = minimoDuplas(tipo);
  const errorDuplas =
    intentoCrear && duplas.length < minimo
      ? `Para este formato necesitás al menos ${minimo} duplas (tenés ${duplas.length}).`
      : "";

  /**
   * Guarda el nombre del torneo y lo valida mientras se escribe.
   * @method cambiarNombre
   * @param {Event} e - Evento del input
   * @return {void}
   */
  const cambiarNombre = (e) => {
    setNombre(e.target.value);
    setErrorNombre(validarNombreTorneo(e.target.value));
  };

  /**
   * Guarda el nombre de la dupla y lo valida mientras se escribe.
   * @param {Event} e - Evento del input
   */
  const cambiarDupla = (e) => {
    const valor = e.target.value;
    setDupla(valor);
    setErrorDupla(valor.trim() ? validarDupla(valor, duplas) : "");
  };

  /**
   * Agrega la dupla escrita si es válida.
   */
  const agregarDupla = () => {
    const error = validarDupla(dupla, duplas);
    setErrorDupla(error);
    if (error) return;
    setDuplas([...duplas, dupla.trim()]);
    setDupla("");
  };

  /**
   * Carga las 8 duplas de ejemplo si no se supera el máximo.
   */
  const cargarEjemplo = () => {
    if (duplas.length + DUPLAS_EJEMPLO.length > MAX_DUPLAS) {
      setErrorDupla(
        `No se pueden cargar las 8 duplas de ejemplo: el máximo es ${MAX_DUPLAS} duplas.`,
      );
      return;
    }
    setDuplas(agregarEjemplo(duplas));
    setErrorDupla("");
  };

  /**
   * Quita una dupla de la lista.
   * @param {number} indice - Posición de la dupla a quitar
   */
  const quitarDupla = (indice) => {
    setDuplas(duplas.filter((_, i) => i !== indice));
    setErrorDupla("");
  };

  /**
   * Elige el tipo de torneo con el teclado (Enter o espacio).
   * @param {KeyboardEvent} e - Evento del teclado
   * @param {string} nuevoTipo - Tipo de torneo de la tarjeta
   */
  const elegirTipoConTeclado = (e, nuevoTipo) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setTipo(nuevoTipo);
    }
  };

  /**
   * Valida el formulario y, si está todo bien, crea el torneo.
   */
  const generarTorneo = () => {
    const error = validarNombreTorneo(nombre);
    setErrorNombre(error);
    setIntentoCrear(true);
    if (error || duplas.length < minimo) return;
    onCrear(
      crearTorneo({ nombre, descripcion, lugar, sortear, tipo, duplas }),
    );
  };

  return (
    <>
      <section className="card court">
        <h2>Nuevo torneo</h2>
        <label htmlFor="nombre-torneo">Nombre del torneo</label>
        <input
          id="nombre-torneo"
          maxLength={50}
          placeholder="Copa Verano 2026"
          value={nombre}
          onChange={cambiarNombre}
          aria-invalid={errorNombre !== ""}
          aria-describedby={errorNombre ? "error-nombre" : undefined}
        />
        {errorNombre && (
          <p className="error" id="error-nombre" role="alert">
            {errorNombre}
          </p>
        )}

        <label htmlFor="descripcion-torneo">Descripción (opcional)</label>
        <textarea
          id="descripcion-torneo"
          rows={2}
          maxLength={200}
          placeholder="Torneo amistoso, categoría 6ta, premio: un asado..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>

        <label htmlFor="lugar-torneo">Lugar (opcional)</label>
        <input
          id="lugar-torneo"
          maxLength={100}
          placeholder="Ej: Pádel Club Palermo, Buenos Aires"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          onBlur={() => setLugarMapa(lugar.trim())}
        />
        {lugarMapa && (
          <>
            <iframe
              src={urlMapa(lugarMapa)}
              loading="lazy"
              title="Mapa del lugar"
            ></iframe>
            <div className="sub mt">
              <a
                href={urlBusquedaMapa(lugarMapa)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir en Google Maps ↗
              </a>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h3>
          👥 Duplas ({duplas.length}/{MAX_DUPLAS})
        </h3>
        <div className="row">
          <label htmlFor="nombre-dupla" className="visually-hidden">
            Nombre de la dupla
          </label>
          <input
            id="nombre-dupla"
            maxLength={40}
            placeholder="Nombre de la dupla, ej: Gómez / Pérez"
            value={dupla}
            onChange={cambiarDupla}
            aria-invalid={errorDupla !== ""}
            aria-describedby={errorDupla ? "error-dupla" : undefined}
          />
          <Button onClick={agregarDupla}>Agregar</Button>
        </div>
        {errorDupla && (
          <p className="error" id="error-dupla" role="alert">
            {errorDupla}
          </p>
        )}
        <div className="chips">
          {duplas.map((nombreDupla, i) => (
            <div className="chip" key={nombreDupla}>
              <span>{nombreDupla}</span>
              <Button
                onClick={() => quitarDupla(i)}
                ariaLabel={`Eliminar dupla ${nombreDupla}`}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <Button className="ghost mt" onClick={cargarEjemplo}>
          Cargar 8 duplas de ejemplo
        </Button>
      </section>

      <section className="card">
        <h3 id="titulo-tipos">Tipo de torneo</h3>
        <div className="types" role="radiogroup" aria-labelledby="titulo-tipos">
          {TIPOS_TORNEO.map((opcion) => (
            <div
              key={opcion.tipo}
              className={tipo === opcion.tipo ? "type sel" : "type"}
              role="radio"
              aria-checked={tipo === opcion.tipo}
              tabIndex={0}
              onClick={() => setTipo(opcion.tipo)}
              onKeyDown={(e) => elegirTipoConTeclado(e, opcion.tipo)}
            >
              <h4>{opcion.titulo}</h4>
              <p>{opcion.descripcion}</p>
            </div>
          ))}
        </div>
        <label className="check" htmlFor="sortear">
          <input
            type="checkbox"
            id="sortear"
            checked={sortear}
            onChange={(e) => setSortear(e.target.checked)}
          />
          Sortear el orden al azar
        </label>
        <Button className="big mt" onClick={generarTorneo}>
          Generar torneo
        </Button>
        {errorDuplas && (
          <p className="error" role="alert">
            {errorDuplas}
          </p>
        )}
      </section>
    </>
  );
};

export default FormularioTorneo;
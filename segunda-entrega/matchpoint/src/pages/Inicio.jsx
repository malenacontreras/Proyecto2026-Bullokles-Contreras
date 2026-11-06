import { Link } from "react-router-dom";

const Inicio = () => {
  return (
    <>
      {/* Sección principal */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Torneos entre amigos</div>

          <h2>
            Tu <em>torneo.</em>
            <br />A tu manera.
          </h2>

          <p>
            Organizá torneos de pádel entre amigos, armá los cruces y seguí cada
            resultado desde un solo lugar.
          </p>

          <div className="actions">
            <Link className="button primary" to="/organizar">
              Organizar torneo
            </Link>

            <Link className="button outline" to="/torneos">
              Ver torneos
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="section">
        <div className="section-heading">
          <h2>Todo lo que necesitás para tu torneo</h2>
          <p>Una forma simple de tener cada detalle organizado y a la vista.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Organizá</h3>
            <p>
              Creá tu torneo, cargá los participantes y definí toda la
              información necesaria.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Armá los cruces</h3>
            <p>
              Visualizá de forma clara los enfrentamientos y la estructura del
              torneo.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">03</div>
            <h3>Seguí los resultados</h3>
            <p>
              Consultá partidos, resultados, clasificaciones y al ganador del
              torneo.
            </p>
          </article>
        </div>
      </section>

      {/* Sobre MatchPoint */}
      <section className="section">
        <div className="about">
          <div className="about-visual" aria-hidden="true">
            <img src="/Imagenes/paleta_pelotas.avif" alt="" />
          </div>

          <div>
            <div className="eyebrow">¿Quiénes somos?</div>
            <h2>Sobre MatchPoint</h2>
            <p>
              MatchPoint nace para hacer más simple la organización de torneos
              de pádel entre amigos. Desde un solo lugar podés organizar
              participantes, cruces, partidos y resultados.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inicio;

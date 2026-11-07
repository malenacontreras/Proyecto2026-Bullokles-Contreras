import { Link } from "react-router-dom";
/**
 * Pie del sitio con los enlaces a las páginas.
 * @method Footer
 * @return {JSX.Element} Pie de página
 */
const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <nav className="footer-links" aria-label="Navegación del pie de página">
          <Link to="/">Inicio</Link>
          <Link to="/torneos">Torneos</Link>
          <Link to="/organizar">Organizar torneo</Link>
        </nav>

        <span>© 2026 MatchPoint</span>
      </div>
    </footer>
  );
};

export default Footer;

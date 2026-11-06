import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/">
        <span className="brand-mark">
          <img src="/Imagenes/logo.png" alt="Logo de MatchPoint" />
        </span>
        <h1>MatchPoint</h1>
      </NavLink>

      <nav className="main-nav" aria-label="Navegación principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/torneos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Torneos
        </NavLink>

        <NavLink
          to="/organizar"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Organizar torneo
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;

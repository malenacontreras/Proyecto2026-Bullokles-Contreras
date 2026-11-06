/**
 * Botón genérico reutilizable en las distintas páginas.
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función que se ejecuta al hacer click
 * @param {string} [props.className] - Clases CSS del botón
 * @param {string} [props.ariaLabel] - Texto accesible para botones que solo muestran un ícono
 * @returns {JSX.Element} Botón
 */
const Button = ({ children, onClick, className, ariaLabel }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
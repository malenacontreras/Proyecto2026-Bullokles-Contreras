/**
 * Botón genérico reutilizable en las distintas páginas.
 * @method Button
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función que se ejecuta al hacer click
 * @param {string} [props.className] - Clases CSS del botón
 * @param {string} [props.ariaLabel] - Texto accesible para botones que solo muestran un ícono
 * @param {boolean} [props.disabled] - Indica si el botón está deshabilitado
 * @return {JSX.Element} Botón
 */
const Button = ({ children, onClick, className, ariaLabel, disabled }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
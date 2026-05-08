export function Icon({ children, filled = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
    >
      {children}
    </span>
  )
}

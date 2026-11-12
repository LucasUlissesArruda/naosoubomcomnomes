/**
 * SVG Defs globais — gradientes compartilhados por todos os girassóis.
 * Renderizado uma vez, oculto, no topo do documento.
 */
export function SvgDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Pétalas — fileira da frente (near) */}
        <linearGradient id="gpf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e29a17" />
          <stop offset="1" stopColor="#ffd84d" />
        </linearGradient>
        {/* Pétalas — fileira de trás (near) */}
        <linearGradient id="gpb" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c07a0c" />
          <stop offset="1" stopColor="#eeb02a" />
        </linearGradient>
        {/* Pétalas — fileira da frente (far) */}
        <linearGradient id="gff" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#a3761f" />
          <stop offset="1" stopColor="#d3a334" />
        </linearGradient>
        {/* Pétalas — fileira de trás (far) */}
        <linearGradient id="gfb" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7a5614" />
          <stop offset="1" stopColor="#b88a28" />
        </linearGradient>
        {/* Miolo */}
        <radialGradient id="gcore" cx=".42" cy=".38" r=".75">
          <stop offset="0" stopColor="#7d4c1e" />
          <stop offset=".6" stopColor="#4c2c12" />
          <stop offset="1" stopColor="#2b1809" />
        </radialGradient>
      </defs>
    </svg>
  );
}

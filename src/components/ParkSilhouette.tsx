interface Props {
  parkKey: 'magic-kingdom' | 'epcot' | 'hollywood-studios' | 'animal-kingdom';
  className?: string;
  style?: React.CSSProperties;
}

export function ParkSilhouette({ parkKey, className = '', style }: Props) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {parkKey === 'magic-kingdom' && <MagicKingdomPath />}
      {parkKey === 'epcot' && <EpcotPath />}
      {parkKey === 'hollywood-studios' && <HollywoodStudiosPath />}
      {parkKey === 'animal-kingdom' && <AnimalKingdomPath />}
    </svg>
  );
}

// Cinderella Castle silhouette — five spires of varying height, narrow conical
// roofs, flag on the tallest center spire, arched doorway in the base.
// Drawn at 0-64 scale and repositioned/rescaled into this file's 0-100x80
// viewBox via the wrapping transform (uniform scale 1.2, recentered on x=50).
function MagicKingdomPath() {
  return (
    <g transform="translate(50,2) scale(1.2) translate(-32,0)">
      <rect x="12" y="44" width="40" height="16" />
      <rect x="15" y="34" width="6" height="10" />
      <path d="M15 34 L18 24 L21 34Z" />
      <rect x="23" y="28" width="6" height="16" />
      <path d="M23 28 L26 16 L29 28Z" />
      <rect x="28" y="18" width="8" height="26" />
      <path d="M28 18 L32 2 L36 18Z" />
      <rect x="31" y="-1" width="2" height="4" />
      <rect x="35" y="28" width="6" height="16" />
      <path d="M35 28 L38 16 L41 28Z" />
      <rect x="43" y="34" width="6" height="10" />
      <path d="M43 34 L46 24 L49 34Z" />
      <path d="M27 50 Q27 44 32 44 Q37 44 37 50 L37 60 L27 60Z" fill="currentColor" opacity="0.4" />
      <rect x="10" y="60" width="44" height="3" rx="1" />
    </g>
  );
}

// Spaceship Earth (geodesic sphere on tripod legs)
function EpcotPath() {
  return (
    <g>
      <circle cx="50" cy="32" r="28" />
      <path d="M34 57 L24 76" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M50 60 L50 76" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M66 57 L76 76" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

// Hollywood Tower Hotel (Tower of Terror) silhouette
function HollywoodStudiosPath() {
  return (
    <g>
      {/* Water tower roof */}
      <path d="M43 4 L50 0 L57 4Z" />
      {/* Water tower barrel */}
      <rect x="42" y="4" width="16" height="9" rx="2" />
      {/* Narrow top section */}
      <rect x="38" y="13" width="24" height="10" />
      {/* Main building body */}
      <rect x="28" y="23" width="44" height="47" />
      {/* Elevator shaft / drop windows */}
      <rect x="43" y="28" width="14" height="7" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="43" y="41" width="14" height="7" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="43" y="54" width="14" height="7" rx="1" fill="currentColor" opacity="0.3" />
      {/* Side arched windows */}
      <rect x="30" y="34" width="7" height="9" rx="3.5" />
      <rect x="63" y="34" width="7" height="9" rx="3.5" />
      {/* Base/ground line */}
      <rect x="22" y="70" width="56" height="5" rx="1" />
    </g>
  );
}

// Tree of Life silhouette — full rounded canopy from seven overlapping
// circles at one even opacity (no opacity layering — that caused uneven
// dark blotches in review), sitting on a flared vase-shaped trunk/base.
// Same 0-64-to-viewBox transform as MagicKingdomPath.
function AnimalKingdomPath() {
  return (
    <g transform="translate(50,2) scale(1.2) translate(-32,0)">
      <circle cx="32" cy="17" r="18" />
      <circle cx="13" cy="23" r="12.5" />
      <circle cx="51" cy="23" r="12.5" />
      <circle cx="22" cy="9" r="10" />
      <circle cx="42" cy="9" r="10" />
      <circle cx="8" cy="29" r="6.5" />
      <circle cx="56" cy="29" r="6.5" />
      <path d="M27 34 L26 42 C24 50 19 55 13 58 L13 62 L51 62 L51 58 C45 55 40 50 38 42 L37 34 Z" />
    </g>
  );
}

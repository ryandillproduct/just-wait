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

// Spaceship Earth (geodesic sphere with three filled tripod legs and an
// inner highlight circle). Drawn at 0-64 scale and repositioned/rescaled
// via the same wrapping transform as MagicKingdomPath/AnimalKingdomPath.
function EpcotPath() {
  return (
    <g transform="translate(50,2) scale(1.2) translate(-32,0)">
      <circle cx="32" cy="28" r="20" />
      <path d="M20 44 L12 60 L18 60 L24 46Z" />
      <path d="M32 46 L32 60 L38 60 L38 46Z" />
      <path d="M44 44 L52 60 L46 60 L40 46Z" />
      <circle cx="32" cy="28" r="15" fill="currentColor" opacity="0.25" />
    </g>
  );
}

// Simplified Tower of Terror — an abstracted, stepped silhouette (roof
// barrel, narrow top, three stepped tiers, two elevator-shaft accents)
// rather than dense architectural window detail, so it reads clearly at
// badge size. Same 0-64-to-viewBox transform as the other redrawn icons.
function HollywoodStudiosPath() {
  return (
    <g transform="translate(50,2) scale(1.2) translate(-32,0)">
      <path d="M28 0 L32 -4 L36 0Z" />
      <rect x="27" y="0" width="10" height="5" />
      <rect x="23" y="5" width="18" height="10" />
      <rect x="17" y="15" width="30" height="16" />
      <rect x="11" y="31" width="42" height="29" />
      <rect x="26" y="38" width="5" height="16" fill="currentColor" opacity="0.5" />
      <rect x="33" y="38" width="5" height="16" fill="currentColor" opacity="0.5" />
      <rect x="9" y="60" width="46" height="3" rx="1" />
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

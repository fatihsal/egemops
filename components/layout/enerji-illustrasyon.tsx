/** Sidebar altındaki dekoratif yeşil-enerji illüstrasyonu (inline SVG). */
export function EnerjiIllustrasyon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Zemin platformu */}
      <ellipse cx="100" cy="120" rx="88" ry="14" fill="var(--accent)" />
      <rect x="18" y="108" width="164" height="16" rx="8" fill="var(--secondary)" />

      {/* Güneş */}
      <circle cx="164" cy="26" r="12" fill="#fbbf24" />
      <g stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round">
        <line x1="164" y1="6" x2="164" y2="10" />
        <line x1="184" y1="26" x2="180" y2="26" />
        <line x1="149" y1="11" x2="152" y2="14" />
        <line x1="179" y1="11" x2="176" y2="14" />
      </g>

      {/* Rüzgâr türbini */}
      <rect x="41" y="52" width="3.5" height="58" rx="1.75" fill="#cbd5e1" />
      <g transform="translate(42.75 52)" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1">
        <ellipse cx="0" cy="-13" rx="3.2" ry="13" />
        <ellipse
          cx="0"
          cy="-13"
          rx="3.2"
          ry="13"
          transform="rotate(120)"
        />
        <ellipse
          cx="0"
          cy="-13"
          rx="3.2"
          ry="13"
          transform="rotate(240)"
        />
      </g>
      <circle cx="42.75" cy="52" r="3.5" fill="#94a3b8" />

      {/* Bina */}
      <rect x="96" y="72" width="52" height="40" rx="3" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
      <rect x="103" y="80" width="9" height="9" rx="1.5" fill="#bfdbfe" />
      <rect x="117" y="80" width="9" height="9" rx="1.5" fill="#bfdbfe" />
      <rect x="131" y="80" width="9" height="9" rx="1.5" fill="#bfdbfe" />
      <rect x="117" y="96" width="10" height="16" rx="1.5" fill="#93c5fd" />

      {/* Bina çatısındaki güneş paneli */}
      <rect x="98" y="66" width="48" height="8" rx="1.5" fill="#1e3a8a" />
      <g stroke="#3b82f6" strokeWidth="1">
        <line x1="110" y1="66" x2="110" y2="74" />
        <line x1="122" y1="66" x2="122" y2="74" />
        <line x1="134" y1="66" x2="134" y2="74" />
      </g>

      {/* Yerdeki tilt güneş paneli */}
      <line x1="66" y1="108" x2="70" y2="92" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="84" y1="108" x2="80" y2="92" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <polygon points="60,90 86,86 90,98 64,102" fill="#1e40af" />
      <g stroke="#60a5fa" strokeWidth="1">
        <line x1="68.5" y1="88.7" x2="72.5" y2="100.7" />
        <line x1="77" y1="87.3" x2="81" y2="99.3" />
        <line x1="61.5" y1="94" x2="88" y2="90" />
      </g>

      {/* Yeşillik */}
      <rect x="159" y="100" width="3" height="12" fill="#92400e" />
      <circle cx="160.5" cy="99" r="9" fill="#22c55e" />
      <circle cx="169" cy="103" r="6.5" fill="#16a34a" />
      <circle cx="30" cy="105" r="6" fill="#22c55e" />
    </svg>
  );
}

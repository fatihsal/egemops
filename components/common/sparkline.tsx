/** Eksensiz mini trend çizgisi (inline SVG). */
export function Sparkline({
  data,
  renk = "currentColor",
  className,
}: {
  data: number[];
  renk?: string;
  className?: string;
}) {
  const w = 72;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const aralik = max - min || 1;
  const noktalar = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / aralik) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <polyline
        points={noktalar}
        stroke={renk}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

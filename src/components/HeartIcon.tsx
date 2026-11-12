const HEART_D = 'M0 .9C-1.15 .15 -.85 -.85 0 -.35C.85 -.85 1.15 .15 0 .9Z';

export function HeartIcon() {
  return (
    <svg
      className="ico-heart"
      viewBox="-1.2 -1 2.4 2.05"
      aria-hidden="true"
    >
      <path d={HEART_D} fill="currentColor" />
    </svg>
  );
}

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface DigitSpanProps {
  char: string;
}

function DigitSpan({ char }: DigitSpanProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevCharRef = useRef<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (prevCharRef.current !== null && prevCharRef.current !== char) {
      if (!reduce && typeof el.animate === 'function') {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(-30%)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      }
    }
    prevCharRef.current = char;
  }, [char, reduce]);

  return (
    <span ref={spanRef} className="digit">
      {char}
    </span>
  );
}

interface DigitsProps {
  value: string;
  className?: string;
  id?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function Digits({ value, className = '', id, 'aria-hidden': ariaHidden }: DigitsProps) {
  return (
    <div className={`digits ${className}`} id={id} aria-hidden={ariaHidden}>
      {value.split('').map((ch, idx) => (
        <DigitSpan key={idx} char={ch} />
      ))}
    </div>
  );
}


import { useEffect, useState, useMemo } from 'react';
import siteConfig from '../config/siteConfig';
import { Digits } from './Digits';
import { HeartIcon } from './HeartIcon';
import { useReveal } from '../hooks/useReveal';

function getParts(now: number, start: number) {
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 864e5);
  // Total de horas acumuladas que o casal está junto (ex: 10680 horas e não 00)
  const totalHours = Math.floor(diff / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  return { days, totalHours, m, s };
}

export function Counter() {
  const startMs = useMemo(() => new Date(siteConfig.start).getTime(), []);

  const [now, setNow] = useState<number>(() => Date.now());

  const sinceText = useMemo(() => {
    try {
      const dt = new Date(startMs);
      const dFmt = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: siteConfig.startZone,
      }).format(dt);
      const tFmt = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: siteConfig.startZone,
      })
        .format(dt)
        .replace(':', 'h');
      return `desde ${dFmt} · ${tFmt}`;
    } catch {
      return '';
    }
  }, [startMs]);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    function tick() {
      setNow(Date.now());
      timerId = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    }

    timerId = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(timerId);
  }, []);

  const { days, totalHours, m, s } = getParts(now, startMs);

  const daysStr = String(days).padStart(3, '0');
  const hoursStr = String(totalHours);
  const minsStr = String(m).padStart(2, '0');
  const secsStr = String(s).padStart(2, '0');

  const ariaLabel = `Estamos juntos há ${days} dias (${totalHours} horas no total), ${m} minutos e ${s} segundos`;

  const sinceRef = useReveal<HTMLParagraphElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  const daysRef = useReveal<HTMLDivElement>();
  const hmsRef = useReveal<HTMLDivElement>();
  const quoteRef = useReveal<HTMLParagraphElement>();

  return (
    <section className="counter" id="contador" aria-labelledby="counterTitle">
      <div className="gutter" id="counterBox" role="group" aria-label={ariaLabel}>
        <p className="eyebrow reveal" id="counterSince" ref={sinceRef}>
          {sinceText}
        </p>
        <h2 className="h2 reveal" id="counterTitle" ref={titleRef}>
          {siteConfig.counter.title}
        </h2>

        <div
          className="days reveal"
          ref={daysRef}
          style={{ '--rd': '.15s' } as React.CSSProperties}
        >
          <Digits value={daysStr} id="cDays" aria-hidden="true" />
          <span className="unit" id="uDays">
            {siteConfig.counter.days}
          </span>
        </div>

        <div
          className="hms reveal"
          ref={hmsRef}
          style={{ '--rd': '.3s' } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="cell">
            <Digits value={hoursStr} id="cHours" />
            <span className="lab" id="uHours">
              {siteConfig.counter.hours}
            </span>
          </div>
          <div className="cell">
            <Digits value={minsStr} id="cMins" />
            <span className="lab" id="uMins">
              {siteConfig.counter.minutes}
            </span>
          </div>
          <div className="cell">
            <Digits value={secsStr} id="cSecs" />
            <span className="lab" id="uSecs">
              {siteConfig.counter.seconds}
            </span>
          </div>
        </div>

        <p
          className="quote reveal"
          ref={quoteRef}
          style={{ '--rd': '.45s' } as React.CSSProperties}
          id="counterQuote"
        >
          {siteConfig.counter.quote} <HeartIcon />
        </p>
      </div>
    </section>
  );
}

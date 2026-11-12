import { useSyncExternalStore } from 'react';

const query =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function subscribe(cb: () => void) {
  query?.addEventListener('change', cb);
  return () => query?.removeEventListener('change', cb);
}

function getSnapshot() {
  return query?.matches ?? false;
}

/** Retorna true quando o usuário prefere movimento reduzido */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

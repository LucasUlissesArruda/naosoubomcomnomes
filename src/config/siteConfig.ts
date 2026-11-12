/* ===== siteConfig.ts — TUDO que voce pode querer mudar fica aqui ===== */

export interface PhotoConfig {
  /** Caminho da foto real (ex: "fotos/01.jpg"). Vazio = imagem temporária. */
  src: string;
  /** Legenda exibida na polaroid */
  caption: string;
  /** Data exibida na polaroid */
  date: string;
  /** Posição no grid: left, right ou center */
  side: 'left' | 'right' | 'center';
  /** Rotação em graus da polaroid */
  tilt: number;
  /** Deslocamento vertical em px */
  lift: number;
  /** Texto alternativo para acessibilidade (padrão: caption) */
  alt?: string;
  /** Rotação da fita adesiva em graus (padrão: alternado ±3) */
  tape?: number;
}

export interface SiteConfig {
  intro: {
    /** Frase de abertura */
    line: string;
    /** Texto do hint de scroll */
    hint: string;
  };
  /** Data/hora de início do relacionamento (ISO 8601 com offset de fuso) */
  start: string;
  /** Fuso horário para exibição formatada (ex: "America/Sao_Paulo") */
  startZone: string;
  memories: {
    eyebrow: string;
    title: string;
    lede: string;
    /** Lista de fotos do álbum */
    photos: PhotoConfig[];
  };
  counter: {
    title: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    quote: string;
  };
  final: {
    /** Frases da mensagem final */
    lines: string[];
  };
}

const siteConfig: SiteConfig = {
  intro: {
    line: 'Tudo começou em um dia especial...',
    hint: 'role para continuar',
  },

  /* Data e hora do relacionamento — ajuste aqui */
  start: '2025-08-24T14:00:00-03:00',
  startZone: 'America/Sao_Paulo',

  memories: {
    eyebrow: 'Nossa história',
    title: 'Nossas lembranças',
    lede: 'Algumas coisas a gente guarda no coração. Outras, a gente revela devagar, como uma polaroid.',

    /* FOTOS: troque "src" pelo caminho real (ex: "fotos/01.jpg").
       src vazio = imagem temporária gerada automaticamente.
       Para trocar, basta colocar o arquivo em public/fotos/ e preencher o src. */
    photos: [
      { src: 'fotos/WhatsApp Image 2026-11-12 at 14.49.13.jpeg', caption: 'O começo de tudo', date: '24 ago 2025', side: 'left', tilt: -4, lift: 0 },
      { src: 'fotos/IMG_3410.jpg', caption: 'Te Amo', date: 'data especial', side: 'right', tilt: 3, lift: 56 },
      { src: 'fotos/WhatsApp Image 2026-11-12 at 14.49.16.jpeg', caption: 'Em todos', date: 'data especial', side: 'center', tilt: -2, lift: 0 },
      { src: 'fotos/WhatsApp Image 2026-11-12 at 14.49.131.jpeg', caption: 'Os Detalhes', date: 'data especial', side: 'left', tilt: 5, lift: 20 },
      { src: 'fotos/sim.jpeg', caption: 'Para Sempre Nós', date: 'data especial', side: 'right', tilt: -3, lift: 72 },
      { src: 'fotos/nao.jpeg', caption: 'E ainda tem muito mais', date: 'hoje e sempre', side: 'center', tilt: 2, lift: 0 },
    ],
  },

  counter: {
    title: 'Estamos juntos há...',
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
    quote: 'E cada segundo ao seu lado vale a pena.',
  },

  final: {
    lines: [
      'De todos os lugares do mundo, meu lugar favorito continua sendo ao seu lado.',
    ],
  },
};

export default siteConfig;

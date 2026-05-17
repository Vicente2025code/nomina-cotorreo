export const theme = {
  colors: {
    bg: "#0b1020",
    bgWarm: "#1a1208",
    text: "#ffffff",
    muted: "#cfd3e1",
    accent: "#f5c34b",
    accentWarm: "#e8744a",
    cr: "#168f3f",
  },
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
  },
  sizes: {
    titleHuge: 180,
    titleBig: 140,
    titleMed: 96,
    body: 64,
    small: 44,
  },
};

export const fps = 30;
export const width = 1080;
export const height = 1920;

export const TIMINGS = {
  opening: { from: 0, duration: 450 },
  firstDays: { from: 450, duration: 900 },
  months: { from: 1350, duration: 2700, perMonth: 270 },
  adventures: { from: 4050, duration: 900 },
  stats: { from: 4950, duration: 450 },
  messages: { from: 5400, duration: 1500 },
  closing: { from: 6900, duration: 1200 },
  totalFrames: 8100,
} as const;

export const AUDIO = {
  adventure: {
    src: "audio/adventure-of-a-lifetime.mp3",
    startAtFrame: 240,
    endAtFrame: 5400,
    volume: 1,
    fadeOutFrames: 60,
  },
  everglow: {
    src: "audio/everglow.mp3",
    startAtFrame: 5400,
    endAtFrame: 8100,
    volume: 1,
    fadeInFrames: 30,
    fadeOutFrames: 90,
  },
} as const;

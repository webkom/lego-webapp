/*
 * The hero's decorative bead layout, expressed in grid units so every bead
 * is on-grid by construction: the dot pattern is GRID_SIZE cells with dot
 * rows at ROW_OFFSET + row * GRID_SIZE, and useTitleBeadAnimation relies on
 * bead centers riding those rows exactly.
 */
export const GRID_SIZE = 40;
export const ROW_OFFSET = 20;

const HALF_GRID = GRID_SIZE / 2;

const BEAD_SIZE = 13;

export type Bead = {
  row: number;
  col: number;
  slide: 'A' | 'B' | 'C';
  duration: number;
  delay?: number;
  opacity?: number;
  dark?: boolean;
  reverse?: boolean;
};

export const beadRowCenter = ({ row }: Bead) => ROW_OFFSET + row * GRID_SIZE;

export const beadTop = (bead: Bead) => beadRowCenter(bead) - BEAD_SIZE / 2;

export const beadRight = ({ col }: Bead) => col * HALF_GRID - BEAD_SIZE / 2;

export const beads: Bead[] = [
  { row: 0, col: 6, slide: 'A', duration: 8 },
  { row: 0, col: 18, slide: 'A', duration: 8, delay: 1.1, opacity: 0.4 },
  {
    row: 2,
    col: 10,
    slide: 'B',
    duration: 3.5,
    opacity: 0.35,
    dark: true,
    reverse: true,
  },
  { row: 2, col: 22, slide: 'B', duration: 3.5, delay: 0.9, opacity: 0.55 },
  { row: 3, col: 7, slide: 'C', duration: 12, delay: 0.5, opacity: 0.45 },
  {
    row: 3,
    col: 14,
    slide: 'A',
    duration: 7.5,
    delay: 1.3,
    opacity: 0.3,
    dark: true,
    reverse: true,
  },
  { row: 3, col: 24, slide: 'B', duration: 6, delay: 0.2, opacity: 0.5 },
  { row: 4, col: 4, slide: 'C', duration: 13, opacity: 0.7 },
  {
    row: 4,
    col: 16,
    slide: 'B',
    duration: 4.5,
    delay: 1,
    opacity: 0.35,
    reverse: true,
  },
  {
    row: 4,
    col: 26,
    slide: 'C',
    duration: 13,
    delay: 2,
    opacity: 0.25,
    dark: true,
  },
  {
    row: 6,
    col: 6,
    slide: 'A',
    duration: 6,
    delay: 0.4,
    opacity: 0.3,
    dark: true,
    reverse: true,
  },
  { row: 6, col: 12, slide: 'B', duration: 3, delay: 1.6, opacity: 0.5 },
  { row: 6, col: 23, slide: 'A', duration: 10, delay: 0.7, opacity: 0.6 },
  { row: 8, col: 9, slide: 'B', duration: 7, delay: 2.3, opacity: 0.45 },
  {
    row: 8,
    col: 19,
    slide: 'C',
    duration: 9,
    delay: 1.4,
    opacity: 0.2,
    dark: true,
    reverse: true,
  },
  { row: 10, col: 5, slide: 'B', duration: 5, delay: 0.6, opacity: 0.55 },
  {
    row: 10,
    col: 15,
    slide: 'A',
    duration: 8.5,
    delay: 1.8,
    opacity: 0.25,
    dark: true,
    reverse: true,
  },
  { row: 8, col: 25, slide: 'C', duration: 11, delay: 0.3, opacity: 0.35 },
  { row: 10, col: 10, slide: 'A', duration: 9, delay: 2.6, opacity: 0.45 },
  {
    row: 12,
    col: 8,
    slide: 'A',
    duration: 4,
    delay: 1.2,
    opacity: 0.4,
    reverse: true,
  },
  { row: 12, col: 21, slide: 'B', duration: 9.5, delay: 2.1, opacity: 0.6 },
];

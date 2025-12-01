import { useEffect, useRef } from 'react';
import { useCurrentUser } from '~/redux/slices/auth';
import { updateChristmasSlots } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import styles from './ArcadeGame.module.css';

type ArcadeGameBoxProps = {
  dateNr?: number;
};
const ArcadeGameBox = ({ dateNr = 1 }: ArcadeGameBoxProps) => {
  const currentUser = useCurrentUser();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const listeningRef = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    const canvas = ref.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // 1, 8, 11, 15, 20
    const numberData = {
      1: [
        { x: 11, w: 1 },
        { x: 10, w: 2 },
        { x: 9, w: 3, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 11, w: 1, space: [1] },
        { x: 9, w: 5, space: [] },
      ],
      8: [
        { x: 8, w: 5 },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 8, w: 5 },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 8, w: 5 },
      ],
      11: [
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 6, w: 8, space: [2, 3, 4, 5] },
        { x: 5, w: 9, space: [1, 3, 4, 5, 7] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 5, w: 11, space: [5] },
      ],
      15: [
        { x: 6, w: 10, space: [1, 2, 3, 4] },
        { x: 5, w: 6, space: [2, 3, 4] },
        { x: 4, w: 7, space: [1, 3, 4, 5] },
        { x: 6, w: 5, space: [1, 2, 3] },
        { x: 6, w: 5, space: [1, 2, 3] },
        { x: 6, w: 5, space: [1, 2, 3] },
        { x: 6, w: 10, space: [1, 2, 3, 4] },
        { x: 6, w: 11, space: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 6, w: 11, space: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 6, w: 11, space: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 6, w: 11, space: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 6, w: 11, space: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 4, w: 12, space: [5, 6] },
      ],
      20: [
        { x: 4, w: 13, space: [5, 6, 7] },
        { x: 9, w: 9, space: [1, 3, 4, 5, 6, 7] },
        { x: 9, w: 9, space: [1, 3, 4, 5, 6, 7] },
        { x: 9, w: 9, space: [1, 3, 4, 5, 6, 7] },
        { x: 9, w: 9, space: [1, 3, 4, 5, 6, 7] },
        { x: 9, w: 9, space: [1, 3, 4, 5, 6, 7] },
        { x: 4, w: 14, space: [5, 6, 8, 9, 10, 11, 12] },
        { x: 3, w: 15, space: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13] },
        { x: 3, w: 15, space: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13] },
        { x: 3, w: 15, space: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13] },
        { x: 3, w: 15, space: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13] },
        { x: 3, w: 15, space: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13] },
        { x: 4, w: 13, space: [5, 6, 7] },
      ],
    };

    // INITIAL VALUES
    const fps = 10;
    const DESIGN_W = 420;
    const DESIGN_H = 420;
    const START_Y = 3;
    const END_Y = START_Y + numberData[dateNr].length - 1;
    const grid: number[][] = [];
    const s = 20;
    let vx = 1;
    let running = false;
    let finished = false;

    for (let i = 0; i <= DESIGN_W / s; i++) {
      const row: number[] = [];
      for (let j = 0; j <= DESIGN_H / s; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    const red = getComputedStyle(canvas)
      .getPropertyValue('--danger-color')
      .trim();
    const dpr = window.devicePixelRatio || 1;

    // SIZE HANDLER
    const setSize = () => {
      const cssW = parent.clientWidth;
      const cssH = parent.clientHeight;

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const scale = Math.min(cssW / DESIGN_W, cssH / DESIGN_H);
      const offX = Math.floor((cssW - DESIGN_W * scale) / 2);
      const offY = Math.floor((cssH - DESIGN_H * scale) / 2);

      ctx.translate(offX, offY);
      ctx.scale(scale, scale);
    };
    setSize();

    const player = {
      x: 0,
      y: START_Y,
      w: numberData[dateNr][0]['w'],
      space: numberData[dateNr][0]['space'],
    };

    function drawSquares(ctx) {
      for (let i = 0; i < player.w; i++) {
        const space: number[] = player?.space ?? [];
        if (!space.includes(i)) {
          ctx.beginPath();
          ctx.fillStyle = red;
          if (!finished) {
            ctx.fillRect((player.x + i) * s, player.y * s, s, s);
          }
        }
      }
    }

    type Row = { x: number; w: number; space?: number[] };
    const numberDataFormatted = (numberData[dateNr] as Row[]).map((r) => ({
      ...r,
      space: r.space ?? [],
    }));

    function drawNumber(ctx) {
      for (let i = 0; i < numberDataFormatted.length; i++) {
        const thisData = numberDataFormatted[i];
        const space: number[] = thisData?.space ?? [];
        for (let j = 0; j < thisData['w']; j++) {
          if (!space.includes(j)) {
            ctx.beginPath();
            if (player.y > i + START_Y || finished) {
              ctx.fillStyle = red;
            } else {
              ctx.fillStyle = 'rgb(90, 30, 30)';
            }

            ctx.fillRect((thisData.x + j) * s, (i + START_Y) * s, s, s);
          }
        }
      }
    }

    function moveSquares() {
      player.x += vx;
    }

    // REPEATING SECTION
    const id = window.setInterval(() => {
      drawNumber(ctx);
      drawSquares(ctx);
      if (running) {
        if (player.x <= 0) {
          vx = Math.abs(vx);
        }
        if (player.x * s >= DESIGN_W - player.w * s) {
          vx = -Math.abs(vx);
        }

        ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
        moveSquares();
        drawNumber(ctx);
        drawSquares(ctx);
      }
    }, 1000 / fps);

    // SPACE EVENTLISTENER
    const handleKey = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
      if (e.type === 'touchstart' || e.type === 'touchend') {
        e.preventDefault();
      }

      if (
        ('code' in e && e.code === 'Space') ||
        ('button' in e && e.button === 0) ||
        e.type === 'touchstart'
      ) {
        // Sjekker om space blir spammet og om spillet kjører
        if (running) {
          if (finished) {
            finished = false;
          }

          /* console.log("player.y, NED_Y",player.y, END_Y) */
          if (player.y < END_Y) {
            vx = 1;
            // Hvis x-posisjon er riktig i forhold til tallet skal den gå én rad ned og få ny form
            if (player.x == numberDataFormatted[player.y - START_Y]['x']) {
              player.y += 1;
              player.w = numberDataFormatted[player.y - START_Y]['w'];
              player.space = numberDataFormatted[player.y - START_Y]['space'];
            }
            // Hvis ikke riktig skal posisjon og form resettes
            else {
              player.y = START_Y;
              player.w = numberDataFormatted[0]['w'];
              player.space = numberDataFormatted[0]['space'];
            }
          } else {
            if (player.x == numberDataFormatted[player.y - START_Y]['x']) {
              vx = 0;
              running = false;
              finished = true;
              console.log('FINISHED and reset');
              player.y = START_Y;
              player.w = numberDataFormatted[0]['w'];
              player.space = numberDataFormatted[0]['space'];

              if (currentUser) {
                dispatch(
                  updateChristmasSlots({
                    slots: [...currentUser.christmasSlots, dateNr],
                    username: currentUser.username,
                  }),
                );
              }
            }
          }

          // Uansett oppdateres x blir 0
          player.x = 0;
        }

        // Hvis Y er før END skal running bli true
        if (player.y < END_Y) {
          running = true;
        }
      }
    };

    window.addEventListener('resize', setSize);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleKey);
    window.addEventListener('touchstart', handleKey, { passive: false }); // ← mobil

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleKey);
      window.removeEventListener('touchstart', handleKey); // ← mobil
      listeningRef.current = false;
      window.clearInterval(id);
    };
  });

  return (
    <div className={styles.arcadeGameWrapper}>
      <canvas ref={ref} />
    </div>
  );
};

export default ArcadeGameBox;

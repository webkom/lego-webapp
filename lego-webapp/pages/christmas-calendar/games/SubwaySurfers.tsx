import { useEffect, useRef } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 280;
const GROUND_THICKNESS = 2;

const GRAVITY = 500;
const JUMP_SPEED = -300;

const PLAYER_X = 30;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const STANDING_Y = GROUND_Y - PLAYER_HEIGHT;

const CACTUS_WIDTH = 25;
const CACTUS_HEIGHT = 50;
const CACTUS_SPEED = 300;

type Rect = { x: number; y: number; width: number; height: number };

const overlaps = (a: Rect, b: Rect): boolean => {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
};

const SubwaySurfers = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const player = { y: 0, vy: 0 };
    const cactus = { x: CANVAS_WIDTH };
    let gameOver = false;
    let frameId = 0;
    let previousTimeStamp: number | null = null;

    const update = (dt: number) => {
      if (gameOver) return;
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y >= STANDING_Y) {
        player.vy = 0;
        player.y = STANDING_Y;
      }

      cactus.x -= CACTUS_SPEED * dt;
      if (cactus.x + CACTUS_WIDTH < 0) {
        cactus.x = CANVAS_WIDTH;
      }
      if (overlaps(
        {
          x: PLAYER_X,
          y: player.y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
        },
        {
          x: cactus.x,
          y: GROUND_Y - CACTUS_HEIGHT,
          width: CACTUS_WIDTH,
          height: CACTUS_HEIGHT,
        },
      )) {
        gameOver = true;
      }
    };


    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, GROUND_THICKNESS);
      ctx.fillRect(
        cactus.x,
        GROUND_Y - CACTUS_HEIGHT,
        CACTUS_WIDTH,
        CACTUS_HEIGHT,
      );
      ctx.fillRect(PLAYER_X, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

      if (gameOver) {
        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.font = '16px sans-serif';
        ctx.fillText(
          'Press space to restart',
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 30,
        );
      }
    };

    const tick = (timeStamp: number) => {
      frameId = requestAnimationFrame(tick);
      if (previousTimeStamp === null) {
        previousTimeStamp = timeStamp;
        return;
      }
      const dt = (timeStamp - previousTimeStamp) / 1000;
      previousTimeStamp = timeStamp;

      update(dt);
      draw();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          if (!e.repeat) {
            resetGame();
          }
          return
        }
        if (player.y >= STANDING_Y) {
          player.vy = JUMP_SPEED;
        }
      }
    };

    const resetGame = () => {
      player.y = 0;
      player.vy = 0;
      cactus.x = CANVAS_WIDTH;
      gameOver = false;
    };

    window.addEventListener('keydown', onKeyDown);
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />;
};

export default SubwaySurfers;

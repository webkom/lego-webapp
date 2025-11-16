// Canvas.tsx
import { useEffect, useRef } from "react";


const ArcadeGameBox = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    const canvas = ref.current!;
    if (!canvas) return
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement
    if (!parent) return

    const numberData = {
      1: [
        { x: 8, w: 5 },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
/*         { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 8, w: 5 },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 7, w: 7, space: [1, 2, 3, 4, 5] },
        { x: 8, w: 5 }, */
      ]

    }

    // INITIAL VALUES
    const fps = 15;
    const DESIGN_W = 420
    const DESIGN_H = 420
    const START_Y = 3
    const END_Y = START_Y + numberData["1"].length
    const grid: number[][] = []
    const s = 20
    let vx = 1
    let currentY = START_Y
    let running = false

    for (let i = 0; i <= DESIGN_W / s; i++) {
      const row: number[] = []
      for (let j = 0; j <= DESIGN_H / s; j++) {
        row.push(0)
      }
      grid.push(row)
    }
    const red = getComputedStyle(canvas).getPropertyValue('--danger-color').trim();
    const dpr = window.devicePixelRatio || 1;

    // SIZE HANDLER
    const setSize = () => {
      const cssW = parent?.clientWidth
      const cssH = Math.round(cssW * (DESIGN_H / DESIGN_W))

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const scale = Math.min(cssW / DESIGN_W, cssH / DESIGN_H)
      const offX = Math.floor((cssW - DESIGN_W * scale) / 2);
      const offY = Math.floor((cssH - DESIGN_H * scale) / 2);

      ctx.translate(offX, offY);
      ctx.scale(scale, scale);
    }
    setSize();

    const player = {
      x: 0,
      y: START_Y,
      w: numberData["1"][0]["w"],
      space: numberData["1"][0]["space"]
    }

    function drawSquares(ctx) {
      for (let i = 0; i < player.w; i++) {
        const space: number[] = player?.space ?? []
        if (!space.includes(i)) {
          ctx.beginPath();
          ctx.fillStyle = red
          ctx.fillRect((player.x + i) * s, player.y * s, s, s);
        }
      }
    }

    type Row = { x: number; w: number; space?: number[] };
    const numberDataFormatted = (numberData["1"] as Row[]).map(r => ({ ...r, space: r.space ?? [] }))

    function drawNumber(ctx) {
      for (let i = 0; i < numberDataFormatted.length; i++) {
        const thisData = numberDataFormatted[i]
        const space: number[] = thisData?.space ?? []
        for (let j = 0; j < thisData["w"]; j++) {
          if (!space.includes(j)) {
            ctx.beginPath();
            if (currentY > i + START_Y) {
              ctx.fillStyle = red
            } else {
              ctx.fillStyle = "rgb(90, 30, 30)"
            }

            ctx.fillRect((thisData.x + j) * s, (i + START_Y) * s, s, s);
          }
        }
      }
    }

    function moveSquares() {
      player.x += vx
    }

    // REPEATING SECTION
    const id = window.setInterval(() => {
      console.log("Running interval", running)
      drawNumber(ctx)
      drawSquares(ctx)
      if (running) {
        if (player.x <= 0) { vx = Math.abs(vx); }
        if (player.x * s >= DESIGN_W - player.w * s) { vx = -Math.abs(vx); }

        ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
        moveSquares()
        drawNumber(ctx)
        drawSquares(ctx)
      }
    }, 1000 / fps);



    // SPACE EVENTLISTENER
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!e.repeat && running) {
          console.log(numberDataFormatted[currentY - START_Y])
          if (currentY < END_Y) {
            console.log(player.x, numberDataFormatted[currentY - START_Y]["x"])
            if (player.x == numberDataFormatted[currentY - START_Y]["x"]) {
              currentY += 1
              player.w = numberDataFormatted[currentY - START_Y]["w"]
              player.space = numberDataFormatted[currentY - START_Y]["space"]
            } else {
              currentY = START_Y
              player.w = numberDataFormatted[0]["w"]
              player.space = numberDataFormatted[0]["space"]

            }
          } else {
            running = false
          }
          player.y = currentY
          player.x = 0
        } else {
          running = true
        }

      }
      (e.target as HTMLElement).blur()
      e.preventDefault()
    };

    window.addEventListener("resize", setSize)
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener("keydown", handleKey)
      listeningRef.current = false;
      window.clearInterval(id)
    }
  });

  return (
    <canvas
      ref={ref}
      style={{ display: "block" }}
    />
  );
}

export default ArcadeGameBox  
import c64 from '~/assets/fonts/c64.ttf';
import pxxl from './pxxl';
// this ttf is actually a bdf font, but jest doesn't want to import bdf files

function animateAbakus(
  canvas,
  {
    radius = 10,
    padding = 6,
    // Padding between pixels
    offsetY = 40,
    lineSpacing = 5,
    sideWidth = 10,
    width = 640,
    PIXELS,
  } = {},
) {
  const height = 6 * (2 * radius + padding + lineSpacing) + 2 * offsetY;
  canvas.width = width;
  canvas.height = height;
  const xs = PIXELS.map((pixel) => pixel.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const context = canvas.getContext('2d');
  const d = ((maxX - minX) * (radius * 2 + padding)) / 2 + sideWidth * 2;
  const offsetX = width / 2 - d;

  function draw(time) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 7; i++) {
      context.fillStyle = 'rgba(0,0,0, .3)';
      context.fillRect(
        0,
        offsetY + i * (2 * radius + padding + lineSpacing),
        width,
        2,
      );
    }

    context.fillStyle = 'rgba(186, 115, 50, 0.9)';
    context.fillRect(0, 0, sideWidth, height);
    context.fillRect(width - sideWidth, 0, sideWidth, height);
    PIXELS.forEach((pixel, i) => {
      const x = pixel.x * (radius * 2 + padding);
      const y = pixel.y * (radius * 2 + padding + lineSpacing);
      const opacity = Math.cos(i) * Math.cos(i) + 0.5;
      const ratio = i / Math.max(1, PIXELS.length);
      context.fillStyle = 'rgba(255, 0, 0, ' + opacity + ')';
      context.beginPath();
      context.arc(
        offsetX + x + 1.5 * Math.sin(0.005 * ratio * time),
        offsetY + y,
        radius,
        0,
        Math.PI * 2,
      );
      context.closePath();
      context.fill();
    });
  }

  const start = Date.now();

  function render() {
    draw(Date.now() - start);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

const render = (statusCode, canvas) =>
  pxxl(c64, statusCode, function (pixels) {
    animateAbakus(canvas, {
      PIXELS: pixels,
    });
  });

export default render;

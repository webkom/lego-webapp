import { useCallback, useRef, useState } from 'react';
import type { CropperCanvas, CropperImage, CropperSelection } from 'cropperjs';

// Cropperjs tries to $define its custom elements which does not work with vike/ssr
if (typeof window !== 'undefined') {
  import('cropperjs');
}

type Props = {
  src: string;
  aspectRatio?: number;
  className?: string;
};

/**
 * A minimal react implementation for cropperjs@2.x
 * with handy features like:
 *
 * - Fits canvas and image to uploaded image dimensions.
 * - Prevents selection from going outside image/canvas
 * - Lego colors
 *
 * @returns Cropper - the cropper component
 * @returns withCroppedBlob - accepts a callback for interacting with the cropped result
 * @returns isReady - boolean indicating whether the cropper/image is loaded
 */
const useCropper = () => {
  const [isReady, setIsReady] = useState(false);
  const imageRef = useRef<CropperImage | null>(null);
  const canvasRef = useRef<CropperCanvas | null>(null);
  const selectionRef = useRef<CropperSelection | null>(null);

  const fitImageAndCanvas = useCallback(
    ({ naturalWidth, naturalHeight }: HTMLImageElement) => {
      const image = imageRef.current;
      const canvas = canvasRef.current;
      const selection = selectionRef.current;
      if (!image || !canvas || !selection) return;

      canvas.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;

      const scale = canvas.offsetWidth / naturalWidth;
      const horizontalOffset = (canvas.offsetWidth - naturalWidth) / 2;
      const verticalOffset = (canvas.offsetHeight - naturalHeight) / 2;

      image.$setTransform(scale, 0, 0, scale, horizontalOffset, verticalOffset);
      selection.initialCoverage = 1;
      setIsReady(true);
    },
    [],
  );

  const keepInBounds = useCallback((event: CustomEvent<CropperSelection>) => {
    const canvas = canvasRef.current;
    const selection = selectionRef.current;
    if (!canvas || !selection) return;

    const { x, y, width, height } = event.detail;
    const maxX = canvas.offsetWidth - width;
    const maxY = canvas.offsetHeight - height;

    const tolerance = 0.01; // damn floating point accuracy
    const isInBounds =
      x >= 0 - tolerance &&
      y >= 0 - tolerance &&
      x <= maxX + tolerance &&
      y <= maxY + tolerance;
    if (isInBounds) return;

    event.preventDefault();

    const isMoving = width === selection.width && height === selection.height;
    if (isMoving && maxX >= 0 && maxY >= 0)
      selection.$change(
        Math.min(Math.max(x, 0), maxX),
        Math.min(Math.max(y, 0), maxY),
      );
  }, []);

  const attachImageRef = useCallback(
    (image: CropperImage | null) => {
      imageRef.current = image;
      setIsReady(false);
      image?.$ready(fitImageAndCanvas);
    },
    [fitImageAndCanvas],
  );

  const Cropper = useCallback(
    ({ src, className, aspectRatio }: Props) => (
      <cropper-canvas key={src} background class={className} ref={canvasRef}>
        <cropper-image
          ref={attachImageRef}
          src={src}
          alt="Photo to be cropped"
          scalable
          translatable
        />
        <cropper-shade hidden />
        <cropper-handle action="select" plain />
        <cropper-selection
          ref={(el) => {
            selectionRef.current = el;
            el?.addEventListener('change', keepInBounds as EventListener);
          }}
          aspect-ratio={aspectRatio}
          precise
          movable
          resizable
          outlined
          theme-color="var(--lego-red-color)"
        >
          <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0)" />
          <cropper-handle
            action="n-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="e-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="s-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="w-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="ne-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="nw-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="se-resize"
            theme-color="var(--lego-red-color)"
          />
          <cropper-handle
            action="sw-resize"
            theme-color="var(--lego-red-color)"
          />
        </cropper-selection>
      </cropper-canvas>
    ),
    [attachImageRef, keepInBounds],
  );

  const withCroppedBlob = (callback: BlobCallback) => {
    const image = imageRef.current;
    const selection = selectionRef.current;
    if (!image || !selection) return;

    const [scale] = image.$getTransform();
    return selection
      .$toCanvas({ width: selection.width / scale })
      .then((canvas) => canvas.toBlob(callback));
  };

  return {
    Cropper,
    withCroppedBlob,
    isReady,
  };
};

const Cropper = (props: Props) => useCropper().Cropper(props);

export { Cropper, useCropper };
export default Cropper;

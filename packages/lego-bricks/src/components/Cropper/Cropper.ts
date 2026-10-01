import type {
  CropperCanvas,
  CropperHandle,
  CropperImage,
  CropperSelection,
  CropperShade,
} from 'cropperjs';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type _DetailedHTMLProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;

interface LegoCropperElements {
  ['cropper-canvas']: _DetailedHTMLProps<CropperCanvas> & {
    background?: boolean;
    class?: string;
  };
  ['cropper-image']: _DetailedHTMLProps<CropperImage> & {
    src?: string;
    alt?: string;
    rotatable?: boolean;
    scalable?: boolean;
    translatable?: boolean;
  };
  ['cropper-shade']: _DetailedHTMLProps<CropperShade>;
  ['cropper-handle']: _DetailedHTMLProps<CropperHandle> & {
    action?: string;
    plain?: boolean;
  };
  ['cropper-selection']: _DetailedHTMLProps<CropperSelection> & {
    movable?: boolean;
    resizable?: boolean;
    precise?: boolean;
    outlined?: boolean;
  };
}

export default LegoCropperElements;

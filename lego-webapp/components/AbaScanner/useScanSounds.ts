import { useRef } from 'react';
import scanErrorSound from '~/assets/sounds/scan-error.wav';
import scanSuccessSound from '~/assets/sounds/scan-success.mp3';

const useScanSounds = () => {
  const sounds = useRef<{
    success: HTMLAudioElement;
    error: HTMLAudioElement;
  } | null>(null);

  return (isSuccess: boolean) => {
    sounds.current ??= {
      success: new window.Audio(scanSuccessSound),
      error: new window.Audio(scanErrorSound),
    };
    const sound = isSuccess ? sounds.current.success : sounds.current.error;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };
};

export default useScanSounds;

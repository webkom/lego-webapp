import { useRef } from 'react';
import scanSuccessSound from '~/assets/sounds/good-sound.mp3';
import scanErrorSound from '~/assets/sounds/scan-error.wav';

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

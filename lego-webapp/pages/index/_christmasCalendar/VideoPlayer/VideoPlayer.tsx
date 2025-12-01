import { useState, useEffect, useRef, useCallback } from 'react';
import { TextInput } from '~/components/Form';
import { updateChristmasSlots } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './VideoPlayer.module.css';

const info = {
  2: {
    answer: 348,
    margin: 30,
    question:
      'Hvor lenge klarte de å løpe til sammen? (svar f.eks:"90" hvis du tror de klarer 1 min og 30 sek. margin på 30sek+-)',
    video1: 'https://www.youtube.com/embed/lwCKDNU_PTU?si=zzPJQZCwe31QUfec',
    video2: 'https://www.youtube.com/embed/q9pCjCnlHlE?si=EdlCcQ12ZXMqwstv',
  },
  7: {
    answer: 212,
    margin: 10,
    question:
      'Hvor mange høydemeter klarerer de til sammen?(svar f.eks:"5". margin på 10m+-)',
    video1: 'https://www.youtube.com/embed/9SkKf6ImOOM?si=cFtXXMkuDYE87Wwc',
    video2: 'https://www.youtube.com/embed/hPRKd1zbeb4?si=U10CEXnCLw-qVLZ4',
  },
  16: {
    answer: 12.59,
    margin: 1,
    question:
      'Hvor lang tid bruker de på å chugge 3 glass med vin?(svar f.eks:"1.5" hvis du tror de klarer det på 1,5 sekunder. margin 1sek+-)',
    video1: 'https://www.youtube.com/embed/e7GUshZDs7I?si=-XMqwnSv890hkDnI',
    video2: 'https://www.youtube.com/embed/D8JKPkWX7xo?si=qao1HZX3j69lGa2y',
  },
};

const VideoPlayer = ({ day = -1 }) => {
  const { answer, question, video1, video2, margin } = info[day] || {};
  const [videoFile, setVideoFile] = useState(video1);
  const [Text, setText] = useState(question);
  const [showText, setShowText] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const playerRef = useRef(null);
  const playerInstanceRef = useRef<any>(null);
  const submittedValueRef = useRef('');

  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  const handleVideoEnd = useCallback(() => {
    setShowText(true);
    setShowBox(false);
    if (submittedValueRef.current != '') {
      const submittedNumber = Number(submittedValueRef.current);
      if (
        !isNaN(submittedNumber) &&
        submittedNumber >= answer - margin &&
        submittedNumber <= answer + margin
      ) {
        setText('Gratulerer! Riktig svar var: ' + answer);
        if (currentUser) {
          dispatch(
            updateChristmasSlots({
              slots: [...currentUser.christmasSlots, day],
              username: currentUser.username,
            }),
          );
        }
      } else {
        setText('Du svarte dessverre galt. Riktig svar var: ' + answer);
      }
    } else {
      setShowBox(true);
    }
  }, [answer, currentUser, day, dispatch, margin]);

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.ENDED = 0
      if (event.data === 0) {
        handleVideoEnd();
      }
    };

    // Create or update the player when videoFile changes
    const setupPlayer = () => {
      if (playerRef.current && videoFile && (window as any).YT) {
        if (playerInstanceRef.current) {
          // If player exists, load the new video
          const videoId = extractVideoId(videoFile);
          if (videoId) {
            playerInstanceRef.current.loadVideoById(videoId);
          }
        } else {
          // Create new player instance
          const videoId = extractVideoId(videoFile);
          if (videoId) {
            playerInstanceRef.current = new (window as any).YT.Player(
              playerRef.current,
              {
                height: '100%',
                width: '100%',
                videoId: videoId,
                events: {
                  onStateChange: onPlayerStateChange,
                },
              },
            );
          }
        }
      }
    };

    // Wait for YT API to be ready
    if ((window as any).YT && (window as any).YT.Player) {
      setupPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = setupPlayer;
    }

    return () => {
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, [videoFile, handleVideoEnd]);

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    // Handle both embed and regular YouTube URLs
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    );
    if (youtubeMatch) return youtubeMatch[1];
    return url;
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isNaN(Number(inputValue))) {
      submittedValueRef.current = inputValue;
      setVideoFile(video2);
      setShowBox(false);
      setShowText(false);
    }
  };

  return (
    <>
      <div id="youtube-player" ref={playerRef} className={styles.video} />

      {showText && <div className={styles.text}>{Text}</div>}
      {showBox && (
        <TextInput
          className={styles.box}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv inn svaret ditt"
          centered={true}
        />
      )}
    </>
  );
};

export default VideoPlayer;

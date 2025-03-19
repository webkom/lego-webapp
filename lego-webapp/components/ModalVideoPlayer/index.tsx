import React, { useState } from 'react';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.css'; // Import styles for react-modal-video
import styles from './ModalVideoPlayer.module.css'; // Import our custom styles

const BRAINROT: boolean = true;

const videoIds: string[] = [
  'Wl959QnD3lM',
  '0HHZhFXz5b0',
  'F6WppvmDtP4',
  'rI3AA7KxJkQ',
  'WePNs-G7puA',
  'qyebBnusEoQ',
  'rYA6iLhjJu0',
  'wjEXseOFeGk',
  'I1aQiTV3ZjE',
  'md9-jG4RzXs',
  'O7DQ8AV2TZo',
  'uDM3Hy8Sfmw',
  'M93UWv-9Vfg',
];

export const getRandomVideoId = (): string => {
  return videoIds[Math.floor(Math.random() * videoIds.length)];
};

type Props = {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ videoId, isOpen, onClose }: Props) => {
  if (!isOpen) {
    return null;
  }

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className={styles.modalWrapper}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Drag handle */}
      <div className={styles.dragHandle} onMouseDown={handleMouseDown}>
        Drag Me
      </div>

      <div className={styles.videoContainer}>
        <ModalVideo
          channel="youtube"
          youtube={{ mute: 0, autoplay: 1, controls: 0 }}
          isOpen={isOpen}
          videoId={videoId}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export const SubwaySurfers = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className={styles.subwaySurfers}
      style={{ top: position.y, left: position.x, position: 'fixed' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.handlebar} onMouseDown={handleMouseDown}>
        Drag Me
      </div>
      <iframe
        width="341"
        height="606"
        src="https://www.youtube.com/embed/zZ7AimPACzc?si=1T8ZHljl4IlT6VQO&autoplay=1&mute=1&loop=1&playlist=L_fcrOyoWZ8&controls=0"
        title="YouTube video player"
        allow="autoplay; encrypted-media; picture-in-picture"
      ></iframe>
    </div>
  );
};

export default Modal;

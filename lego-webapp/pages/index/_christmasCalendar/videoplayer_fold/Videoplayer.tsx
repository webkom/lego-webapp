import { useState } from 'react';
import { TextInput } from '~/components/Form';
import styles from './videoplayer.module.css';

const Videospiller = ({
  question = '',
  videoFile_1 = "",
  videoFile_2 = "",
  fasit = '-1',
}) => {
  const [videoFile, setVideoFile] = useState(videoFile_1);
  const [Text, setText] = useState(question);
  const [showText, setShowText] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  const handleVideoEnd = () => {
    setShowText(true);
    if (submittedValue != '') {
      setShowBox(false);
      if (submittedValue == fasit) {
        setText('Gratulerer! Du svarte rikitg');
      } else {
        setText('Du svarte dessverre galt ):');
      }
    } else {
      setShowBox(true);
    }

    // else{
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSubmittedValue(inputValue); // Only update when Enter is pressed
      setVideoFile(videoFile_2);
      setShowBox(false);
      setShowText(false);
    }
  };

  return (
    <>
      <video
        key={videoFile} // <- forces React to remount when src changes
        onEnded={handleVideoEnd}
        className={styles.video}
        controls
        autoPlay
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showText && <p className={styles.text}>{Text}</p>}
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

      {showBox && submittedValue && (
        <div className={styles.display}>
          <p>Your answer: {submittedValue}</p>
        </div>
      )}
    </>
  );
};

export default Videospiller;

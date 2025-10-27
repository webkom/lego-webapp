import { useState } from 'react';
import sample from "./videoer/sample.mp4";
import styles from './videospiller.module.css';
import { TextInput } from "~/components/Form";

const Videospiller = ({
   text = "Hvor mange Cava flasker kalerer Abacava å drikke på en cava-søndag?",
   videoFile = sample
  }) => {
  const [showBox, setShowBox] = useState(false);
  const [inputValue, setInputValue] = useState("")
  const [submittedValue, setSubmittedValue] = useState('');

  const handleVideoEnd = () => {
    console.log("Video ended!");
    setShowBox(true);
  };

    const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSubmittedValue(inputValue); // Only update when Enter is pressed
    }
  };

  return (
    <>
      <video
        onEnded={handleVideoEnd}
        className={styles.video}
        controls
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showBox && 
      <p className={styles.text}>{text}</p> }
      {showBox && (
        <TextInput 
          className={styles.box}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // But only submit on Enter
          placeholder="Type your answer and press Enter"
        />
      )}git commit -m "first videoplayer commit"

      {showBox && submittedValue && (
        <div className={styles.display}>
          <p>Your answer: {submittedValue}</p>
        </div>
      )}git commit -m "first videoplayer commit"
    </>
  );
};

export default Videospiller;
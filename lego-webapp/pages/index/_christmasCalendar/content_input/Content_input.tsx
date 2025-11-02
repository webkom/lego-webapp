import { useState } from 'react';
import { TextInput } from '~/components/Form';
import styles from './content_input.module.css';

const Content_input = ({
  image = '',
  question = 'Hva er 2 - 3?',
  answer = '-1',
}) => {
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (inputValue == answer) {
        setMessage('Rikitg!');
      } else {
        setMessage('Feil');
      }
    }
  };

  return (
    <>
      <img src={image} alt="" />

      <p className={styles.text}>{question}</p>
      <TextInput
        className={styles.box}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Skriv inn svaret ditt"
        centered={true}
      />
      <p className={styles.text}>{message}</p>
    </>
  );
};

export default Content_input;

import { useState } from 'react';
import { TextInput } from '~/components/Form';
import { updateChristmasSlots } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import abacord from '../../../../assets/Christmas_calender/abacord_logo.png';
import song from '../../../../assets/Christmas_calender/christmas_song.png';
import emoji from '../../../../assets/Christmas_calender/emoji.jpg';
import kenken from '../../../../assets/Christmas_calender/kenken.png';
import tree from '../../../../assets/Christmas_calender/tree.png';
import styles from './ContentInput.module.css';

const info = {
  5: {
    answer: 'Jingle Bells',
    question:
      'Vi har kjørt en kjent julesang gjennom en oversetter gjentatte ganger, kan du gjette hvilken julesang det er?',
    image: song,
  },
  10: {
    answer: '4626',
    question:
      'Hvilke siffer skal stå i de nummererte rutene? Spillet følger vanlige sudoku regler, men sifrene i de avgrensede boksene må bli til tallet oppgitt i venstre hjørne ved å bruke tilsvarende regneopperasjon. Siffrene 1-6 skal brukes.',
    image: kenken,
  },
  12: {
    answer: 'abacord',
    question: 'Hva er navnet på logoen?',
    image: abacord,
  },
  19: {
    answer: 'Polar expressen',
    question: 'Hvilken kjent julefilm er dette?',
    image: emoji,
  },
  22: {
    answer: '18',
    question: 'Hvor mange trekanter er det i juletreet?',
    image: tree,
  },
};

const ContentInput = ({ day = -1 }) => {
  const currentUser = useCurrentUser()
  const dispatch = useAppDispatch()

  const { answer, question, image } = info[day] || {};
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (inputValue.toLowerCase() == answer.toLowerCase()) {
        setMessage('Riktig!');

        if (currentUser) {
          dispatch(updateChristmasSlots({slots: [...currentUser.christmasSlots, day], username: currentUser.username}))
        }        
      } else {
        setMessage('Feil...');
      }
    }
  };

  return (
    <>
      <img className={styles.image} src={image} alt="" />

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

export default ContentInput;

import { Button, Flex } from '@webkom/lego-bricks';
import { useState, useEffect, useCallback } from 'react';
import { updateChristmasSlots } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './QuizGame.module.css';

type QuizGameType = {
  date: number;
};

const QuizGame = ({ date }: QuizGameType) => {
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();
  const slots = {
    3: [
      {
        question: 'Hvor mange interessegrupper er det i Abakus?',
        options: ['32', '27', '28', '34'],
        answer: '32',
      },
      {
        question: 'Hvilke av disse er ikke en av abakus sine verdier?',
        options: ['Bærekraft', 'Attraktiv', 'Effektiv', 'Åpen'],
        answer: 'Effektiv',
      },
      {
        question: 'Hvilket år ble abakus stiftet?',
        options: ['1992', '1997', '1981', '1993'],
        answer: '1997',
      },
    ],
    6: [
      {
        question: 'Hva er hovedingrediensen i brunost?',
        options: ['Myse', 'Rømme', 'Sukker', 'Geit'],
        answer: 'Myse',
      },
      {
        question: 'Hvilken varm drikke er mest populær i Norge?',
        options: ['Kakao', 'Te', 'Kaffe', 'Gløgg'],
        answer: 'Kaffe',
      },
      {
        question: 'Hva er tradisjonelt norsk pålegg laget av potet og fisk?',
        options: ['Røkelaks', 'Potetsalat', 'Lutefisk', 'Laksepaté'],
        answer: 'Lutefisk',
      },
      {
        question: 'Hva slags kjøtt brukes vanligvis i pinnekjøtt?',
        options: ['Ku', 'Okse', 'Geit', 'Sau'],
        answer: 'Sau',
      },
    ],
    13: [
      {
        question: 'Hvilken dag feires Lucia-dagen?',
        options: ['13. des', '25. des', '17. des', '11. des'],
        answer: '13. des',
      },
      {
        question: 'Hvilket land kommer feiringen opprinnelig fra?',
        options: ['Sverige', 'Spania', 'Italia', 'Østerrike'],
        answer: 'Italia',
      },
      {
        question: 'Hva symboliserer lysene Lucia bærer på hodet?',
        options: [
          'Dagene blir lysere',
          'Høstens avslutning',
          'Lysets seier over mørket',
          'Den hellige ånd',
        ],
        answer: 'Lysets seier over mørket',
      },
    ],
    17: [
      {
        question: 'Norge har flere elger enn innbyggere',
        options: ['Sant', 'Usant'],
        answer: 'Usant',
      },
      {
        question:
          'I Sverige finnes det en offisiell konkurranse i å spise lussekatter på tid',
        options: ['Sant', 'Usant'],
        answer: 'Usant',
      },
      {
        question:
          'I Norge er brunost laget av geitemelk, mens i Sveits er brunost laget av ku-melk',
        options: ['Sant', 'Usant'],
        answer: 'Sant',
      },
      {
        question: 'Julenissen har egen postkode i Norge',
        options: ['Sant', 'Usant'],
        answer: 'Sant',
      },
      {
        question:
          'Den lengste dagen (der sola ikke går ned) i Norge varer i over 24 timer på Svalbard om sommeren',
        options: ['Sant', 'Usant'],
        answer: 'Sant',
      },
    ],
    21: [
      {
        question: 'Hvilket krydder brukes ofte for å skape juleduft hjemme?',
        options: ['Gurkemeie', 'Kanel', 'Kardemomme', 'Chilli'],
        answer: 'Kanel',
      },
      {
        question: 'Hva er ofte synonymt med “kos” på norsk??',
        options: ['Stress', 'Eksamen', 'Varme, hygge og ro', 'Intervaller'],
        answer: 'Varme, hygge og ro',
      },
      {
        question: 'Who developed the theory of relativity?',
        options: ['Newton', 'Einstein', 'Galileo', 'Tesla'],
        answer: 'Einstein',
      },
    ],
  };

  const questions = slots[date];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(10);
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [handleNextQuestion, timeLeft]);

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
      if (score + 1 === questions.length) {
        if (currentUser) {
          dispatch(
            updateChristmasSlots({
              slots: [...currentUser.christmasSlots, date],
              username: currentUser.username,
            }),
          );
        }
      }
    }
    handleNextQuestion();
  };

  return (
    <>
      {showResult ? (
        <Flex column alignItems="center" gap={'20px'}>
          <h2>GRATULERER!</h2>
          <Flex gap={'20px'} alignItems="center">
            <p>
              Dine poeng: {score} / {questions.length}
            </p>
            {score !== questions.length ? (
              <Button
                onPress={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowResult(false);
                  setTimeLeft(10);
                }}
              >
                Begynn på nytt
              </Button>
            ) : (
              false
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex column gap={'20px'} alignItems="center">
          <h2>{questions[currentQuestion].question}</h2>
          <Flex width={'100%'} column alignItems="center">
            <div className={styles.options}>
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  className={styles.optionButton}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className={styles.timer}>Tid igjen: {timeLeft}s</p>
          </Flex>
        </Flex>
      )}
    </>
  );
};
export default QuizGame;

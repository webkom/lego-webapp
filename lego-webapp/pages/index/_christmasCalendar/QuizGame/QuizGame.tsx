import { Button, Flex } from '@webkom/lego-bricks';
import { useState, useEffect, useCallback } from 'react';
import styles from './QuizGame.module.css';

type QuizGameType = {
  index: number;
};

const QuizGame = ({ index }: QuizGameType) => {
  const slots = [
    [
      {
        question: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
        answer: 'Paris',
      },
      {
        question: 'Which language is used for web development?',
        options: ['Python', 'Java', 'C++', 'JavaScript'],
        answer: 'JavaScript',
      },
      {
        question: 'Who developed the theory of relativity?',
        options: ['Newton', 'Einstein', 'Galileo', 'Tesla'],
        answer: 'Einstein',
      },
    ],
  ];

  const questions = slots[index];

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

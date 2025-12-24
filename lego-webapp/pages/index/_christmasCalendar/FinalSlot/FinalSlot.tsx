import { Button, Flex } from '@webkom/lego-bricks';
import React from 'react';
import { updateChristmasSlots } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './FinalSlot.module.css';

const FinalSlot = () => {
  const validateSlots = (arr: number[]): boolean => {
    const expected = new Set<number>(
      Array.from({ length: 23 }, (_, i) => i + 1),
    );

    return (
      arr.length === 23 &&
      arr.every((n) => Number.isInteger(n)) &&
      expected.size === arr.length &&
      arr.every((n) => expected.has(n))
    );
  };

  const [disable, setDisable] = React.useState(false);
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  const completedChristmasSlots = currentUser?.christmasSlots;
  if (!completedChristmasSlots) return null;
  const calendarCompleted = validateSlots(completedChristmasSlots);

  if (calendarCompleted) {
    return (
      <Flex column className={styles.content}>
        <h2>Gratulerer med gjennomføring av julekalenderen!</h2>
        <p>
          Som en belønning for å ha gjort alle lukene, får du en trofé for
          innsatsen denne måneden. Håper du likte julekalenderen!
        </p>
        <p className={styles.signature}>
          God jul og godt nytt år! - nye i Webkom
        </p>
        <Button
          secondary
          disabled={disable}
          className={styles.button}
          onPress={() =>
            currentUser
              ? (dispatch(
                  updateChristmasSlots({
                    slots: [
                      ...currentUser.christmasSlots,
                      24,
                      Math.floor(Date.now() / 1000),
                    ],
                    username: currentUser.username,
                  }),
                ),
                setDisable(true))
              : null
          }
        >
          Fullfør julekalenderen
        </Button>
      </Flex>
    );
  }

  if (completedChristmasSlots.length < 23) {
    return (
      <Flex column className={styles.content}>
        <h2>
          Du har gjort {completedChristmasSlots.length}{' '}
          {completedChristmasSlots.length === 1 ? 'luke' : 'luker'}!
        </h2>
        <p>Kom tilbake når du har gjort alle lukene.</p>
      </Flex>
    );
  }

  return (
    <Flex column className={styles.content}>
      <h2>Oi! Du har gjort noe rart.</h2>
      <p className={styles.signature}>
        God jul og godt nytt år uansett. - nye i Webkom
      </p>
    </Flex>
  );
};

export default FinalSlot;

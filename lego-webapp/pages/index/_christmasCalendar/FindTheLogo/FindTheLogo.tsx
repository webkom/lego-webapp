import { EntityId } from '@reduxjs/toolkit';
import { Button, Flex, Image, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import React, { useState } from 'react';
import { GroupType } from 'app/models';
import { SelectInput } from '~/components/Form';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupsByType } from '~/redux/slices/groups';
import { isNotNullish } from '~/utils';
import styles from './FindTheLogo.module.css';

type Option = {
  value: EntityId | null;
  label: string;
};

type StyleType = {
  [key: string]: string;
};

type FindGameType = {
  logo: string;
  bgImage: string;
  style: StyleType;
  state: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
};

const FindGame = ({ logo, bgImage, style, state, setState }: FindGameType) => {
  return (
    <Flex column>
      <h2>Finn logoen til en komité!</h2>
      <div className={styles.frame}>
        <div className={styles.source}>
          <Image src={bgImage} alt="Bilde" className={styles.bgImage} />
          <button
            className={styles.logoButton}
            style={style}
            onClick={() => setState(state + 1)}
          >
            <Image src={logo} alt="Logo" />
          </button>
        </div>
      </div>
    </Flex>
  );
};

type GuessCommitteeType = {
  answer: string;
  state: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
  setCorrect: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuessCommittee = ({
  answer,
  state,
  setState,
  setCorrect,
}: GuessCommitteeType) => {
  const committees = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Committee),
  );
  const groups = [...committees].filter(isNotNullish);
  const fetching = useAppSelector((state) => state.groups.fetching);
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGroups',
    () => dispatch(fetchAllWithType(GroupType.Committee)),
    [],
  );

  const [selectedCommittee, setSelectedCommittee] = useState<Option | null>(
    null,
  );

  if (isEmpty(groups) || fetching) {
    return <LoadingIndicator loading={fetching} />;
  }
  const hsRecipient = {
    value: null,
    label: 'Hovedstyret',
  };
  const recipientOptions = groups.map((g) => ({
    value: g.id,
    label: g.name,
  }));

  const revyRecipient = {
    value: null,
    label: 'Revy',
  };

  const handleChange = (selected) => {
    setSelectedCommittee(selected);
  };

  const onSubmit = () => {
    if (selectedCommittee && selectedCommittee.label === answer) {
      setCorrect(true);
      setState(state + 1);
    } else {
      setState(state + 1);
    }
  };

  return (
    <Flex column gap={'5px'}>
      <h2>Hvilken komité var det?</h2>
      <Flex gap={'5px'}>
        <SelectInput
          name="guessCommittee"
          value={selectedCommittee || { value: null, label: 'Velg en komité' }}
          onChange={handleChange}
          options={[hsRecipient, ...recipientOptions, revyRecipient]}
          isClearable={false}
          insideModal={true}
        />
        <Button
          secondary
          disabled={selectedCommittee ? false : true}
          onPress={onSubmit}
        >
          Gjett
        </Button>
      </Flex>
    </Flex>
  );
};

type FinalStateType = {
  correct: boolean;
  bgImage: string;
  logo: string;
  committee: string;
  style: StyleType;

  setState: React.Dispatch<React.SetStateAction<number>>;
};

const FinalState = ({
  correct,
  bgImage,
  logo,
  committee,
  style,
  setState,
}: FinalStateType) => {
  return (
    <Flex column width={'100%'} alignItems="center" gap={'20px'}>
      {correct ? (
        <Flex column alignItems="center">
          <h2>Du gjetta riktig!</h2>
          <h3>{committee}</h3>
        </Flex>
      ) : (
        <Flex column alignItems="center">
          <h2>Du gjetta feil</h2>
          <Button onPress={() => setState(1)}>Prøv på nytt</Button>
        </Flex>
      )}
      <div className={styles.finalSource}>
        <Image src={bgImage} alt="Bilde" className={styles.bgImage} />
        <div
          className={styles.logoButton}
          style={{ ...style, opacity: '100%' }}
        >
          <Image src={logo} alt="Logo" />
        </div>
      </div>
    </Flex>
  );
};

type SlotType = {
  committee: string;
  logo: string;
  bgImage: string;
  style: StyleType;
};

const FindTheLogo = ({ date }: { date: number }) => {
  const slots = {
    4: {
      committee: 'readme',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_readme.png',
      bgImage:
        'https://thumbor.abakus.no/kP2YsGjSIizc9O_h0pp3rTiIIjI=/0x700/smart/IMG_8436_Lsoofzd.JPG',
      style: { left: '37%', top: '35%', opacity: '5%' },
    },
    9: {
      committee: 'Koskom',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_koskom.png',
      bgImage:
        'https://thumbor.abakus.no/SvAoXTRafFiZ22nbZ9h84Hta2Wg=/0x700/smart/IMG_2583_vjvfj5J.JPG',

      style: { right: '12%', bottom: '1%', opacity: '7%' },
    },
    14: {
      committee: 'Bankkom',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_bankkom.png',
      bgImage:
        'https://thumbor.abakus.no/ExrfneWvIA3nTLRGeU7qvwAC0ZM=/0x700/smart/IMG_1526_W8gVS8l.JPG',

      style: { right: '8%', bottom: '37%', opacity: '5%' },
    },
    18: {
      committee: 'PR',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_pr.png',
      bgImage:
        'https://thumbor.abakus.no/9OhCG9KUwozRge6UaUyK1zWtsLE=/0x700/smart/IMG_9656_0u27qQe.JPG',

      style: { left: '16%', bottom: '9%', opacity: '7%' },
    },
    23: {
      committee: 'LaBamba',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_labamba.png',
      bgImage:
        'https://thumbor.abakus.no/WrRYqW26BOmNoWJRWefWMhl5nP8=/0x700/smart/IMG_9038.JPG',
      style: { left: '16%', top: '25%', opacity: '8%' },
    },
  };
  const slotToday: SlotType = slots[date];

  const [state, setState] = React.useState(0);
  const [correct, setCorrect] = React.useState(false);
  const states = [
    <FindGame
      key={0}
      logo={slotToday.logo}
      bgImage={slotToday.bgImage}
      style={slotToday.style}
      state={state}
      setState={setState}
    />,
    <GuessCommittee
      key={1}
      answer={slotToday.committee}
      state={state}
      setState={setState}
      setCorrect={setCorrect}
    />,
    <FinalState
      key={2}
      correct={correct}
      bgImage={slotToday.bgImage}
      logo={slotToday.logo}
      committee={slotToday.committee}
      style={slotToday.style}
      setState={setState}
    />,
  ];

  return states[state];
};

export default FindTheLogo;

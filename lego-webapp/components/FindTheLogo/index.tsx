import { Flex, Image, LoadingIndicator } from '@webkom/lego-bricks';
import styles from './index.module.css';
import React from 'react';
import { Field } from 'react-final-form';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupsByType } from '~/redux/slices/groups';
import { GroupType } from 'app/models';
import { isNotNullish } from '~/utils';
import {
  Form,
  LegoFinalForm,
  SelectInput,
  SubmitButton,
} from '~/components/Form';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import { fetchAllWithType } from '~/redux/actions/GroupActions';

type StyleType = {
  [key: string]: string
};

type FindGameType = {
  logo: string;
  bgImage: string;
  style: StyleType;
  state: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
};

const FindGame = ({
  logo,
  bgImage,
  style,
  state,
  setState,
}: FindGameType) => {
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

  const onSubmit = ({ committeeGuess }, form) => {
    form.reset();
    setCorrect(committeeGuess.label === answer ? true : false);
    setState(state + 1);
  };

  return (
    <Flex column>
      <h2>Hvilken komité var det?</h2>
      <LegoFinalForm onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex gap={'var(--spacing-md)'}>
              <Field
                name="committeeGuess"
                placeholder="Velg komité"
                options={[hsRecipient, ...recipientOptions, revyRecipient]}
                value={'committeeGuess'}
                component={SelectInput.Field}
                clearable={false}
              />
              <SubmitButton>Gjett</SubmitButton>
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Flex>
  );
};

type FinalStateType = {
  correct: boolean;
};

const FinalState = ({ correct }: FinalStateType) => {
  return correct ? (
    <Flex column>
      <h2>Du gjetta riktig!</h2>
    </Flex>
  ) : (
    <Flex column>
      <h2>Du gjetta feil</h2>
      <p>...men du fullfører fortsatt luka!</p>
    </Flex>
  );
};

const FindTheLogo = ({ index }: { index: number }) => {
  const slots = [
    {
      committee: 'readme',
      logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_readme.png',
      bgImage:
        'https://thumbor.abakus.no/kP2YsGjSIizc9O_h0pp3rTiIIjI=/0x700/smart/IMG_8436_Lsoofzd.JPG',
      style: { left: '37%', top: '35%', opacity: "3%" },
    },
  ];
  const slotToday = slots[index];

  const [state, setState] = React.useState(0);
  const [correct, setCorrect] = React.useState(false);
  const states = [
    <FindGame
      logo={slotToday.logo}
      bgImage={slotToday.bgImage}
      style={slotToday.style}
      state={state}
      setState={setState}
    />,
    <GuessCommittee
      answer={slotToday.committee}
      state={state}
      setState={setState}
      setCorrect={setCorrect}
    />,
    <FinalState correct={correct} />,
  ];

  return states[state];
};

export default FindTheLogo;

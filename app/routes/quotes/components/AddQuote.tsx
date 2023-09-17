import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { addQuotes } from 'app/actions/QuoteActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { withSubmissionErrorFinalForm } from 'app/components/Form/utils';
import { LoginPage } from 'app/components/LoginForm';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import { navigation } from '../utils';
import styles from './Quotes.css';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type FormValues = {
  text: string;
  source: string;
};

const initialValues: FormValues = {
  text: '',
  source: '',
};

const validate = createValidator({
  text: [required()],
  source: [required()],
});

const AddQuote = () => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const actionGrant = useAppSelector((state) => state.quotes.actionGrant);

  const removeUnnecessaryDash = (source: string) => {
    const dashIndex = source.indexOf('-');
    if (source.slice(0, dashIndex).match(/^ *$/)) {
      source = source.slice(dashIndex + 1).trim();
    }

    return source;
  };

  const onSubmit = (quote: { text: string; source: string }) =>
    withSubmissionErrorFinalForm(
      dispatch,
      addQuotes
    )({
      text: quote.text,
      source: removeUnnecessaryDash(quote.source),
    });

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <div className={styles.root}>
      <Helmet title="Nytt sitat" />
      {navigation('Legg til sitat', actionGrant)}

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <>
            <div className={styles.addQuote}>
              <form onSubmit={handleSubmit}>
                <Field
                  placeholder="Eks: Det er bare å gjøre det"
                  label="Selve sitatet"
                  name="text"
                  component={TextInput.Field}
                />

                <Field
                  placeholder="Eks: Esso"
                  label="Hvor sitatet kommer fra (sleng gjerne med noe snacks!)"
                  name="source"
                  component={TextInput.Field}
                  type="text"
                />

                <div className={styles.clear} />

                <SubmissionError />
                <SubmitButton>Send inn sitat</SubmitButton>
              </form>
            </div>

            <h2>Forhåndsvisning</h2>
            <h3 className="u-ui-heading">Overhørt</h3>
            <div className={styles.innerPreview}>
              {spyValues<FormValues>((values) => (
                <RandomQuote
                  fetchRandomQuote={() => Promise.resolve()}
                  fetchEmojis={() => Promise.resolve()}
                  fetchingEmojis={false}
                  emojis={[]}
                  currentQuote={{
                    id: 1,
                    text: values.text || 'Det er bare å gjøre det',
                    source: removeUnnecessaryDash(values.source) || 'Esso',
                    approved: true,
                    contentTarget: '' as ContentTarget,
                    reactionsGrouped: [],
                    createdAt: moment(),
                    tags: [],
                  }}
                  loggedIn={true}
                  useReactions={false}
                />
              ))}
            </div>
          </>
        )}
      </LegoFinalForm>
    </div>
  );
};

export default AddQuote;

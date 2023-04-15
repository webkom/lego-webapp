import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { Button, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { withSubmissionErrorFinalForm } from 'app/components/Form/utils';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import type { ActionGrant } from 'app/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import { spySubmittable, spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import { navigation } from '../utils';
import styles from './Quotes.css';

type Props = {
  addQuotes: (quote: { text: string; source: string }) => Promise<void>;
  actionGrant: ActionGrant;
};

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

const AddQuote = ({ addQuotes, actionGrant }: Props) => {
  const removeUnnecessaryDash = (source: string) => {
    if (source === undefined) return undefined;

    const dashIndex = source.indexOf('-');
    if (source.slice(0, dashIndex).match(/^ *$/)) {
      source = source.slice(dashIndex + 1).trim();
    }

    return source;
  };

  const onSubmit = (quote: { text: string; source: string }) =>
    withSubmissionErrorFinalForm(addQuotes)({
      text: quote.text,
      source: removeUnnecessaryDash(quote.source),
    });

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
                  label="Hvor sitatet kommer fra (sleng gjerne med noe snaks!)"
                  name="source"
                  component={TextInput.Field}
                  type="text"
                />

                <div className={styles.clear} />

                {spySubmittable((submittable) => (
                  <Button type="submit" disabled={!submittable}>
                    Send inn sitat
                  </Button>
                ))}
              </form>
            </div>

            <h2>Forhåndsvisning</h2>
            <h3 className="u-ui-heading">Overhørt</h3>
            <div className={styles.innerPreview}>
              {spyValues<FormValues>((values) => (
                <RandomQuote
                  fetchRandomQuote={() => Promise.resolve()}
                  addReaction={() => Promise.resolve()}
                  deleteReaction={() => Promise.resolve()}
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

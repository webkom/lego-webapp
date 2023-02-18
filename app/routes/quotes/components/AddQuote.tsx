import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { Button, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { withSubmissionErrorFinalForm } from 'app/components/Form/utils';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import { spySubmittable, spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import { navigation } from '../utils';
import styles from './Quotes.css';

type Props = {
  addQuotes: (quote: { text: string; source: string }) => Promise<unknown>;
  actionGrant: Array<string>;
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
  const onSubmit = withSubmissionErrorFinalForm(addQuotes);

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
                    source: values.source || 'Esso',
                    approved: true,
                    contentTarget: '',
                    reactionsGrouped: [],
                    reactions: [],
                    reactionCount: 0,
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

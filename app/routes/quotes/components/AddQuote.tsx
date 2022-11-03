import { Button, TextEditor, withSubmissionError } from 'app/components/Form';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import { createValidator, required } from 'app/utils/validation';
import { Helmet } from 'react-helmet-async';
import { Field, reduxForm } from 'redux-form';
import { navigation } from '../utils';
import styles from './Quotes.css';
type Props = {
  addQuotes: (arg0: Record<string, any>) => Promise<any>;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
  handleSubmit: (arg0: (arg0: Record<string, any>) => Promise<any>) => void;
  actionGrant: Array<string>;
  text: string;
  source: string;
};

const AddQuote = ({
  addQuotes,
  invalid,
  pristine,
  submitting,
  handleSubmit,
  actionGrant,
  text,
  source,
}: Props) => {
  const disabledButton = invalid || pristine || submitting;
  return (
    <div className={styles.root}>
      <Helmet title="Nytt sitat" />
      {navigation('Legg til sitat', actionGrant)}

      <div className={styles.addQuote}>
        <form onSubmit={handleSubmit(withSubmissionError(addQuotes))}>
          <Field
            placeholder="Eks: Det er bare å gjøre det"
            label="Selve sitatet"
            name="text"
            component={TextEditor.Field}
          />

          <Field
            placeholder="Eks: Esso"
            label="Hvor sitatet kommer fra (sleng gjerne med noe snaks!)"
            name="source"
            component={TextEditor.Field}
            type="text"
          />

          <div className={styles.clear} />

          <Button
            type="submit"
            className={styles.submitQuote}
            disabled={disabledButton}
          >
            Send inn sitat
          </Button>
        </form>
      </div>

      <h2>Forhåndsvisning</h2>
      <div className={styles.outerPreview}>
        <h2>OVERHØRT</h2>
        <div className={styles.innerPreview}>
          <RandomQuote
            fetchRandomQuote={() => Promise.resolve()}
            addReaction={() => Promise.resolve()}
            deleteReaction={() => Promise.resolve()}
            fetchEmojis={() => Promise.resolve()}
            fetchingEmojis={false}
            emojis={[]}
            currentQuote={{
              id: 1,
              text: text || 'Det er bare å gjøre det',
              source: source || 'Esso',
              approved: true,
              contentTarget: '',
              reactionsGrouped: [],
              reactions: [],
            }}
            loggedIn={true}
            useReactions={false}
          />
        </div>
      </div>
    </div>
  );
};

const validate = createValidator({
  text: [required()],
  source: [required()],
});
export default reduxForm({
  form: 'addQuote',
  validate,
})(AddQuote);

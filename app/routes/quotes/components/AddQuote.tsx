import { Page } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { addQuotes } from 'app/actions/QuoteActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import { addToast } from 'app/reducers/toasts';
import { useAppDispatch } from 'app/store/hooks';
import { spyValues } from 'app/utils/formSpyUtils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import styles from './Quotes.module.css';
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const removeUnnecessaryDash = (source: string) => {
    const dashIndex = source.indexOf('-');
    if (source.slice(0, dashIndex).match(/^ *$/)) {
      source = source.slice(dashIndex + 1).trim();
    }

    return source;
  };

  const onSubmit = (quote: { text: string; source: string }) =>
    dispatch(
      addQuotes({
        text: quote.text,
        source: removeUnnecessaryDash(quote.source),
      }),
    ).then(() => {
      navigate('/quotes');
      dispatch(
        addToast({
          message:
            'Sitat ble sendt inn, og vil dukke opp her hvis det blir godkjent!',
          type: 'success',
          dismissAfter: 10000,
        }),
      );
    });

  return (
    <Page title="Legg til sitat" back={{ href: '/quotes' }}>
      <Helmet title="Legg til sitat" />

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
                  dummyQuote={{
                    id: 1,
                    text: values.text || 'Det er bare å gjøre det',
                    source:
                      (values.source && removeUnnecessaryDash(values.source)) ||
                      'Esso',
                    approved: true,
                    contentTarget: '' as ContentTarget,
                    reactionsGrouped: [],
                    createdAt: moment(),
                    tags: [],
                  }}
                  useReactions={false}
                />
              ))}
            </div>
          </>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default guardLogin(AddQuote);

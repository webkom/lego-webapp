import { Page } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { ContentMain } from 'app/components/Content';
import {
  Form,
  LegoFinalForm,
  TextInput,
  SubmitButton,
  SubmissionError,
} from 'app/components/Form';
import RandomQuote from 'app/components/RandomQuote/RandomQuote';
import { spyValues } from 'app/utils/formSpyUtils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import { addQuotes } from '~/redux/actions/QuoteActions';
import { useAppDispatch } from '~/redux/hooks';
import { addToast } from '~/redux/slices/toasts';
import styles from './Quotes.module.css';
import type { ContentTarget } from '~/utils/contentTarget';

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
          <ContentMain>
            <div className={styles.addQuote}>
              <Form onSubmit={handleSubmit}>
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

                <SubmissionError />
                <SubmitButton>Send inn sitat</SubmitButton>
              </Form>
            </div>

            <div>
              <h2>Forhåndsvisning</h2>
              <div className={styles.innerPreview}>
                {spyValues<FormValues>((values) => (
                  <RandomQuote
                    dummyQuote={{
                      id: 1,
                      text: values.text || 'Det er bare å gjøre det',
                      source:
                        (values.source &&
                          removeUnnecessaryDash(values.source)) ||
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
            </div>
          </ContentMain>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default guardLogin(AddQuote);

import { Page } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import {
  Form,
  LegoFinalForm,
  SelectInput,
  SubmitButton,
} from '~/components/Form';
import HTTPError from '~/components/errors/HTTPError';
import { editPartialEvent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { PageChaos } from '../PageChaos';
import win95 from '../win95.module.css';
import { win95SelectStyles } from '../win95SelectStyles';

export default function EventTagEditor() {
  const title = 'Legg til tag på arrangement';
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  const dispatch = useAppDispatch();
  if (!sudoAdminAccess) return <HTTPError statusCode={450} />;
  const onSubmit = (values) => {
    const event = values.event;
    const finalValues = {
      id: event.value,
      tags: values.tags.map((t) => t.value),
    };
    dispatch(editPartialEvent(finalValues)).then(() =>
      navigate('/sudo/achievements/'),
    );
  };
  return (
    <Page title={title} back={{ href: '/sudo/achievements/' }}>
      <Helmet title={title} />
      <PageChaos />
      <div className={win95.desktop}>
        <div className={win95.window}>
          <div className={win95.titleBar}>
            <span>Arrangement-tags - Egenskaper</span>
            <div className={win95.titleBarButtons}>
              <button className={win95.titleBarButton} disabled>
                _
              </button>
              <button className={win95.titleBarButton} disabled>
                □
              </button>
              <button className={win95.titleBarButton} disabled>
                ✕
              </button>
            </div>
          </div>

          <div className={win95.clientArea}>
            <LegoFinalForm onSubmit={onSubmit}>
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <fieldset className={win95.groupBox}>
                    <legend className={win95.groupBoxLabel}>Arrangement</legend>
                    <Field
                      name="event"
                      placeholder="Velg arrangement"
                      filter={['events.event']}
                      component={SelectInput.AutocompleteField}
                      selectStyle={win95SelectStyles}
                    />
                  </fieldset>

                  <fieldset className={win95.groupBox}>
                    <legend className={win95.groupBoxLabel}>Tags</legend>
                    <Field
                      name="tags"
                      label="Overskrives - la feltet stå tomt for å slette alle tags"
                      filter={['tags.tag']}
                      placeholder="Skriv inn tags (trophy:gala, trophy:genfors)..."
                      component={SelectInput.AutocompleteField}
                      selectStyle={win95SelectStyles}
                      isMulti
                      tags
                    />
                  </fieldset>

                  <div className={win95.winButtonRow}>
                    <SubmitButton className={win95.winButton}>
                      Endre tags
                    </SubmitButton>
                  </div>
                </Form>
              )}
            </LegoFinalForm>
          </div>

          <div className={win95.statusBar}>Klar</div>
        </div>
      </div>
    </Page>
  );
}

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
      <LegoFinalForm onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="event"
              placeholder="Velg arrangement"
              filter={['events.event']}
              component={SelectInput.AutocompleteField}
            />
            <Field
              name="tags"
              label="Tags (overskrives)"
              filter={['tags.tag']}
              placeholder="Skriv inn tags (trophy:gala, trophy:genfors)..."
              component={SelectInput.AutocompleteField}
              isMulti
              tags
            />
            <SubmitButton>Endre tags på arrangement</SubmitButton>
          </Form>
        )}
      </LegoFinalForm>
    </Page>
  );
}

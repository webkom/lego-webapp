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
import { editEvent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';




export const EventtagEditor = () => {

  const dispatch = useAppDispatch();

  const onSubmit = (values) => {
    const finalValues = {
      id: values.event.value,
      tags: values.tags.map(t => t.value)
    };
    dispatch(editEvent(finalValues)).then(() =>
      navigate('/lending/'),
    );
  };


  return (
    <LegoFinalForm onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="event"
            placeholder="Velg event"
            filter={['events.event']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            name="tags"
            label="Tags"
            filter={['tags.tag']}
            placeholder="Skriv inn tags (trophy:gala or trophy:genfors)"
            component={SelectInput.AutocompleteField}
            isMulti
            tags
          />
          <SubmitButton>Endre tags på event</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default function EventTagEditor() {
  const title = `Legg til tag på event`;
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={450} />;

  return (
    <Page title={title} back={{ href: `/sudo/achievements/` }}>
      <Helmet title={title} />
      <EventtagEditor />
    </Page>
  );
}

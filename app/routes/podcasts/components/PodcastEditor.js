// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import {
  TextInput,
  SelectInput,
  TextArea,
  legoForm,
} from 'app/components/Form';
import { Form, Field } from 'redux-form';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

type Props = {
  id: number,
  createdAt: string,
  description: string,
  source: string,
  deletePodcast: (number) => Promise<*>,
  push: (string) => void,
  new: boolean,
  pristine: boolean,
  submitting: boolean,
  handleSubmit: (Object) => void,
  initialValues: Object,
};

class PodcastEditor extends Component<Props, *> {
  render() {
    const handleDeletePodcast = () => {
      const {
        deletePodcast,
        initialValues: { id },
        push,
      } = this.props;
      return deletePodcast(id).then(() => {
        push('/podcasts/');
      });
    };

    const header = this.props.new ? 'Legg til Podcast' : 'Rediger Podcast';
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <Content>
        <NavigationTab title={header}>
          <NavigationLink to="/podcasts/">Tilbake</NavigationLink>
        </NavigationTab>
        <Form onSubmit={handleSubmit}>
          <Field
            name="source"
            label="SoundCloud lenke"
            placeholder="https://soundcloud.com/user-279926342/24-du-vil-aldri-tro-hva-disse-guttene-sa-pa-lufta"
            component={TextInput.Field}
          />
          <Field
            name="description"
            label="Beskrivelse"
            placeholder="I ukas podcast snakker vi om..."
            component={TextArea.Field}
          />
          <Field
            name="authors"
            label="Snakker"
            multi
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            name="thanks"
            label="Takk til"
            multi
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />
          <Button disabled={pristine || submitting} submit>
            {this.props.new ? 'Lag podcast' : 'Lagre podcast'}
          </Button>
          {this.props.initialValues.id && (
            <ConfirmModalWithParent
              title="Slett podcast"
              message="Er du sikker på at du vil slette denne podcasten"
              onConfirm={handleDeletePodcast}
            >
              <Button>Delete</Button>
            </ConfirmModalWithParent>
          )}
        </Form>
      </Content>
    );
  }
}

const onSubmit = (
  {
    authors,
    thanks,
    ...rest
  }: {
    source: string,
    description: string,
    authors: Array<Object>,
    thanks: Array<Object>,
  },
  dispach,
  props
) => {
  return props.handleSubmitCallback({
    authors: authors.map((user) => user.value),
    thanks: thanks.map((user) => user.value),
    ...(rest: Object),
  });
};

export default legoForm({
  form: 'podcastEditor',
  onSubmit,
})(PodcastEditor);

// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';
import { fieldArrayMetaPropTypes, fieldArrayFieldsPropTypes } from 'redux-form';
import {
  TextInput,
  SelectInput,
  TextArea,
  legoForm,
  CheckBox
} from 'app/components/Form';
import { Form, Field, FieldArray } from 'redux-form';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './PollEditor.css';

type Props = {
  pristine: boolean,
  submitting: boolean,
  editOrCreatePoll: Object => Promise<*>,
  handleSubmit: Object => Promise<*>,
  editing: boolean,
  initialValues: Object,
  pollId: number,
  deletePoll: () => Promise<*>,
  toggleEdit: () => void
};

type FieldArrayPropTypes = {
  fields: fieldArrayFieldsPropTypes,
  meta: fieldArrayMetaPropTypes
};

const renderOptions = ({
  fields,
  meta: { touched, error }
}: FieldArrayPropTypes) => (
  <div>
    <ul className={styles.options} key="options">
      {fields.map((option, i) => (
        <li className={styles.optionField} key={i}>
          <Field
            name={`${option}.name`}
            label={`Valg nr. ${i + 1}`}
            placeholder={`Valg ${i + 1}`}
            component={TextInput.Field}
            required
          />
          <ConfirmModalWithParent
            title="Slett valg"
            message="Er du sikker på at du vil slette dette valget?"
            onConfirm={() => Promise.resolve(fields.remove(i))}
            closeOnConfirm
            className={styles.deleteOption}
          >
            <Icon name="trash" className={styles.deleteOption} />
          </ConfirmModalWithParent>
        </li>
      ))}
    </ul>

    <Link
      key="addNew"
      onClick={() => {
        fields.push({});
      }}
      className={styles.addOption}
    >
      <Icon name="add-circle" size={25} /> Valg
    </Link>
  </div>
);

class EditPollForm extends Component<Props, *> {
  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      editing,
      deletePoll
    } = this.props;

    return (
      <Content>
        {!editing && (
          <NavigationTab title="Ny avstemning">
            <NavigationLink to="/polls">Tilbake</NavigationLink>
          </NavigationTab>
        )}
        <Form onSubmit={handleSubmit}>
          <Field
            name="title"
            label="Spørsmål"
            placeholder="Hva er din favorittrett?"
            component={TextInput.Field}
            required
          />
          <span />
          <Field
            name="description"
            label="Beskrivelse"
            placeholder="Mer info..."
            component={TextArea.Field}
          />
          <Field
            name="pinned"
            label="Vis på forsiden"
            component={CheckBox.Field}
          />
          <Field
            name="tags"
            label="Tags"
            filter={['tags.tag']}
            placeholder="Skriv inn tags"
            component={SelectInput.AutocompleteField}
            multi
            tags
            shouldKeyDownEventCreateNewOption={({
              keyCode
            }: {
              keyCode: number
            }) => keyCode === 32 || keyCode === 13}
          />
          <FieldArray
            name="options"
            component={renderOptions}
            rerenderOnEveryChange={true}
          />
          <Button
            disabled={pristine || submitting}
            submit
            className={styles.submitButton}
          >
            {editing ? 'Endre avstemning' : 'Lag ny avstemning'}
          </Button>
          {editing && (
            <ConfirmModalWithParent
              title="Slett avstemning"
              message="Er du sikker på at du vil slette avstemningen?"
              onConfirm={() => Promise.resolve(deletePoll())}
              closeOnConfirm
              className={styles.deletePoll}
            >
              <Button>Slett</Button>
            </ConfirmModalWithParent>
          )}
        </Form>
      </Content>
    );
  }
}

const onSubmit = (
  {
    title,
    description,
    tags,
    options,
    pinned,
    ...rest
  }: {
    title: string,
    description: string,
    tags: Array<Object>,
    options: Array<Object>,
    pinned: boolean
  },
  dispach,
  props
) => {
  return props
    .editOrCreatePoll({
      title,
      description,
      tags: tags ? tags.map(val => val.value) : [],
      options,
      pinned: pinned ? pinned : false,
      ...rest
    })
    .then(() => props.toggleEdit());
};

export default legoForm({
  form: 'createPollForm',
  onSubmit,
  initialValues: {
    options: [{}, {}],
    pinned: false
  }
})(EditPollForm);

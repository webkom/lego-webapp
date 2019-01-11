// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import {
  TextInput,
  SelectInput,
  TextArea,
  legoForm
} from 'app/components/Form';
import { Form, Field, FieldArray } from 'redux-form';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './PollEditor.css'

const renderOptions = ({ fields, meta: { touched, error } }) => {
  return [
    <ul className={styles.options} key="options">
      {fields.map((option, i) => (
        <li className={styles.optionField} key={i}>
        <Field
          name={`${option}.name`}
          label={`Valg nr. ${i+1}`}
          placeholder={`Valg ${i+1}`}
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
          <Icon name="trash" className={styles.deleteOption}/>
        </ConfirmModalWithParent>
        </li>
      ))}
    </ul>,

    <Link
      key="addNew"
      onClick={() => {
        fields.push({});
      }}
      className={styles.addOption}
    >
      <Icon name="add-circle" size={25}/> Valg
    </Link>
  ];
};

type Props = {
  pristine: Boolean,
  submitting: Boolean,
  actionGrant: Array<String>,
  editOrCreatePoll: Object => void,
  handleSubmit: Object => void,
  editing: Boolean,
  initialValues: Object,
  pollId: Number,
  deletePoll: () => void,
  toggleEdit: () => void
}

class EditPollForm extends Component<Props, *> {

  render() {

    const { pristine, submitting, handleSubmit, editing, deletePoll} = this.props

    return(
      <Content>
      {!editing && <NavigationTab title="Ny avstemning">
        <NavigationLink to="/polls">Tilbake</NavigationLink>
      </NavigationTab>}
      <Form onSubmit={handleSubmit}>
        <Field
          name="title"
          label="Spørsmål"
          placeholder="Hva er din favorittrett?"
          component={TextInput.Field}
          required
        />
        <span>

        </span>
        <Field
          name="description"
          label="Beskrivelse"
          placeholder="Mer info..."
          component={TextArea.Field}
        />
        <p>{'Bruk tagen "frontpage" for å vise avstemningen på forsiden.'}</p>
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
            {editing ? 'Endre avstemning' : 'Lag ny Avstemning'}
        </Button>
        {editing && <ConfirmModalWithParent
          title="Slett avstemning"
          message="Er du sikker på at du vil slette avstemningen?"
          onConfirm={() => Promise.resolve(deletePoll())}
          closeOnConfirm
          className={styles.deletePoll}
          >
            <Button>Slett</Button>
          </ConfirmModalWithParent>}
      </Form>
    </Content>
    )
  }
}

const onSubmit = (
  {
    title,
    description,
    tags,
    options,
    ...rest
  }: {
    title: String,
    description: String,
    tags: Array<String>,
    options: Array<Object>
  },
  dispach,
  props
) => {
  return props.editOrCreatePoll({
    title,
    description,
    tags: tags ? tags.map(val => val.value) : [],
    options,
    ...rest
  }).then(() => props.toggleEdit())
};


export default legoForm({
  form: 'createPollForm',
  onSubmit,
  initialValues:{
    options: [{}, {}]
  }
})(EditPollForm);

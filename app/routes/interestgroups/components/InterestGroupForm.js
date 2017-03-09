import React from 'react';
import styles from './InterestGroup.css';
import { TextEditor, TextInput, Button } from 'app/components/Form';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Upload from 'app/components/Upload';

const InterestGroupForm = ({ handleSubmit, buttonText, header }) => (
  <form onSubmit={handleSubmit}>
    <h1>{header}</h1>
    <Field
      className={styles.textInput}
      placeholder='Name'
      name='name'
      component={TextInput.Field}
    />
    <Field
      className={styles.textEditor}
      placeholder='Description'
      name='description'
      component={TextEditor.Field}
    />
    <Field
      className={styles.textEditor}
      placeholder='Text'
      name='text'
      component={TextEditor.Field}
    />
    <div className={styles.content}>
      <div>
        <Upload>Last opp bilde</Upload>
      </div>
      <Button type='submit'>{buttonText}</Button>
    </div>
  </form>
);

function validateInterestGroup(data) {
  const errors = {};
  if (!data.name) {
    errors.text = 'Vennligst fyll ut dette feltet';
  }

  if (!data.text) {
    errors.text = 'Vennligst fyll ut dette feltet';
  }

  if (!data.description) {
    errors.source = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

function mapStateToProps(state, props) {
  if (props.group) {
    return {
      initialValues: {
        'name': props.group.name || '',
        'description': props.group.description || '',
        'text': props.group.text || ''
      }
    };
  }
  return {};
}

export default compose(
  connect(mapStateToProps, null),
  reduxForm({
    form: 'interestGroupForm',
    validate: validateInterestGroup
  }))(InterestGroupForm);

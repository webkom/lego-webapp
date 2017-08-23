import React from 'react';
import styles from './InterestGroup.css';
import {
  TextEditor,
  TextInput,
  Button,
  ImageUploadField
} from 'app/components/Form';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { uploadFile } from 'app/actions/FileActions';
import { updateInterestGroupPicture } from 'app/actions/InterestGroupActions';

const InterestGroupForm = ({
  groupId,
  handleSubmit,
  buttonText,
  header,
  uploadFile,
  updateInterestGroupPicture
}) =>
  <form onSubmit={handleSubmit}>
    <h1 className={styles.mainHeader}>
      {header}
    </h1>
    <Field
      className={styles.textInput}
      placeholder="Name"
      name="name"
      component={TextInput.Field}
    />
    <Field
      className={styles.textEditor}
      placeholder="Description"
      name="description"
      component={TextEditor.Field}
    />
    <Field
      className={styles.textEditor}
      placeholder="Text"
      name="descriptionLong"
      component={TextEditor.Field}
    />
    <Field
      name="picture"
      component={ImageUploadField.Field}
      uploadFile={uploadFile}
      edit={token => updateInterestGroupPicture(groupId, token)}
    />
    <div className={styles.content}>
      <div className={styles.Upload}>
        <Upload>Last opp bilde</Upload>
      </div>
    </div>
  </form>;

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
        name: props.group.name || '',
        description: props.group.description || '',
        descriptionLong: props.group.descriptionLong || ''
      }
    };
  }
  return {};
}

const mapDispatchToProps = {
  uploadFile,
  updateInterestGroupPicture
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'interestGroupForm',
    validate: validateInterestGroup
  })
)(InterestGroupForm);

import styles from './InterestGroup.css';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor, TextInput, Button } from 'app/components/Form';
import Upload from 'app/components/Upload';

class InterestGroupCreate extends Component {
  state = {
    editorOpen: false,
    name: '',
    description: ''
  };

  onSubmit = () => {
    this.props.createInterestGroup(this.state.name, this.state.description, this.state.text);
  }

  updateNameField = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  updateDescription = (event) => {
    this.setState({
      description: event.target.value
    });
  }

  updateField = (event) => {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <div className={styles.root}>
        <h1>Opprett ny interessegruppe</h1>
        <Field
          className={styles.textInput}
          onChange={this.updateNameField}
          name='name'
          placeholder='Navn på interessegruppe'
          component={TextInput.Field}
        />
        <Field
          className={styles.textEditor}
          onChange={this.updateField}
          name='description'
          placeholder='Kort beskrivelse som vises på forsiden'
          component={TextEditor.Field}
        />
        <Field
          className={styles.textEditor}
          onChange={this.updateField}
          name='text'
          placeholder='Lengre beskrivelse av interessegruppen'
          component={TextEditor.Field}
        />
        <div className={styles.content}>
          <Upload>
            Last opp bilde
          </Upload>
          <div>
            <Button onClick={this.onSubmit}>
              Lag ny interessegruppe
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function validateInterestGroup(data) {
  const errors = {};
  if (!data.text) {
    errors.text = 'Vennligst fyll ut dette feltet';
  }

  if (!data.description) {
    errors.source = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

export default reduxForm({
  form: 'interestGroupCreate',
  validate: validateInterestGroup
})(InterestGroupCreate);

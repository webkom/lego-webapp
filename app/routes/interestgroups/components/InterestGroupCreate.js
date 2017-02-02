import styles from './InterestGroup.css';
import React, { Component } from 'react';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';
import Button from 'app/components/Button';

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
        <TextInput className={styles.textInput} onChange={this.updateNameField} placeholder='Navn på interessegruppe' />
        <TextEditor className={styles.textEditor} onChange={this.updateField} placeholder='Beskrivelse' />
        <TextEditor className={styles.textEditor} onChange={this.updateField} placeholder='Text' />
        <div className={styles.content}>
          <div>
            <form>
              <p>Last opp bilde</p>
              <input type='file' name='user-song' /><br />
              <input type='submit' value='Upload' />
            </form>
          </div>
          <div>
            <Button onClick={this.onSubmit}>Lag ny interessegruppe</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default InterestGroupCreate;

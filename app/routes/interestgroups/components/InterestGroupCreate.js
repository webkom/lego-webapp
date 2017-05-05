import styles from './InterestGroup.css';
import React, { Component } from 'react';
import InterestGroupForm from './InterestGroupForm';

class InterestGroupCreate extends Component {
  state = {
    editorOpen: false
  };

  handleCreation = ({ name, description, text }) => {
    this.props.createInterestGroup(name, description, text);
  };

  render() {
    return (
      <div className={styles.root}>
        <InterestGroupForm
          onSubmit={this.handleCreation}
          buttonText="Opprett interessegruppe"
          header="Lag ny interessegruppe"
        />
      </div>
    );
  }
}

export default InterestGroupCreate;

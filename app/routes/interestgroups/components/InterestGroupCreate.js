import styles from './InterestGroup.css';
import React, { Component } from 'react';
import InterestGroupForm from './InterestGroupForm';

class InterestGroupCreate extends Component {
  state = {
    editorOpen: false
  };

  handleCreation = ({ name, description, text }) => {
    this.props.createInterestGroup(name, description, text).then(group => {
      const groupId = group.payload.result;
      this.props.router.push(`/interestgroups/${groupId}`);
    });
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

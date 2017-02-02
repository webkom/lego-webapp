import styles from './InterestGroup.css';
import React, { Component } from 'react';
import InterestGroup from './InterestGroup';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';
import { Link } from 'react-router';

class InterestGroupList extends Component {
  state = {
    editorOpen: false,
    name: '',
    description: '',
    text: ''
  };

  props: Props;

  onSubmit = () => {
    this.props.createInterestGroup(this.state.name, this.state.description, this.state.text);
  }

  updateNameField = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  updateField = (event) => {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    const groups = this.props.interestGroups.map((group, key) => (
      <InterestGroup
        group={group}
        key={key}
      />
    ));
    return (
      <div className={styles.root}>
        <div className={styles.section}>
          <div>
            <h1>Interessegrupper</h1>
            <p>
              <strong>Her</strong> finner du all praktisk informasjon knyttet til våre
              interessegrupper.
            </p>
          </div>
          <div>
            <Link to={'/interestgroups/create'} className={styles.link}>
              <Button>Lag ny interessegruppe</Button>
            </Link>
          </div>
        </div>
        <div className='groups'>
          {groups}
        </div>
      </div>
    );
  }
}

export default InterestGroupList;

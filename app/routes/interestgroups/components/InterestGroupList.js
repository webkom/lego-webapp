import styles from './InterestGroup.css';
import React, { Component } from 'react';
import InterestGroup from './InterestGroup';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';

class InterestGroupList extends Component {
  state = {
    editorOpen: false
  };
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
            <Button onClick={() => this.setState({ editorOpen: true })}>Lag ny interessegruppe
            </Button>
          </div>
        </div>
        <Modal
          keyboard={false}
          show={this.state.editorOpen}
          onHide={() => this.setState({ editorOpen: false })}
          closeOnBackdropClick={false}
        >
          <h1>Hello world</h1>
          <TextInput className={styles.textInput} placeholder='Navn på interessegruppe' />
          <TextEditor className={styles.textEditor} placeholder='Beskrivelse' />
          <form>
            <p>Last opp bilde</p>
            <input type='file' name='user-song' /><br />
            <input type='submit' value='Upload' />
          </form>
        </Modal>
        <div className='groups'>
          {groups}
        </div>
      </div>
    );
  }
}

export default InterestGroupList;

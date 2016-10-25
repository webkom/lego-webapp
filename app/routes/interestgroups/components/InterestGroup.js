import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';
import Modal from 'app/components/Modal';
import Button from 'app/components/Button';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';

class InterestGroup extends Component {
  state = {
    editorOpen: false
  };

  render() {
    return (
      <div>
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
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <h2>{this.props.group.name}</h2>
            <p>{this.props.group.descriptionLong}</p>
          </div>
          <Image className={styles.interestPic} src={getImage(this.props.group.id)} />
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
      </div>
    );
  }
}

export default InterestGroup;

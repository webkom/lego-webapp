import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';
import Modal from 'app/components/Modal';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';
import Button from 'app/components/Button';

class InterestGroup extends Component {
  state = {
    editorOpen: false,
    name: this.props.group.name,
    descriptionLong: this.props.group.descriptionLong
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <h1 className={styles.detail}>{this.props.group.name}</h1>
            <p>{this.props.group.descriptionLong}</p>
          </div>
          <Image className={styles.interestPicDetail} src={getImage(this.props.group.id)} />
        </div>
        <div className={styles.button}>
          <Button onClick={() => this.setState({ editorOpen: true })}>Rediger interessegruppe
          </Button>
        </div>
        <h2>Kontaktinformasjon</h2>
        <p>
          Martin<br />
          Call me anytime bby gurl, love you long time (30 s confirmed, can provide evidence)<br />
          martyboy@alphamale.com
        </p>
        <Modal
          keyboard={false}
          show={this.state.editorOpen}
          onHide={() => this.setState({ editorOpen: false })}
          closeOnBackdropClick={false}
        >
          <h1>Rediger interessegruppe</h1>
          <TextInput
            className={styles.textInput}
            value={this.state.name}
            onChange={(event) => this.setState({ name: event.target.value })}
          />
          <TextEditor
            className={styles.textEditor}
            value={this.state.descriptionLong}
            onChange={(event) => this.setState({ descriptionLong: event.target.value })}
          />
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

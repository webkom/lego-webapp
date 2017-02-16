import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import Modal from 'app/components/Modal';
import TextInput from 'app/components/Form/TextInput';
import TextEditor from 'app/components/Form/TextEditor';
import Button from 'app/components/Button';
import { FlexColumn, FlexRow } from 'app/components/FlexBox';
import Upload from 'app/components/Upload';

class InterestGroupDetail extends Component {
  state = {
    editorOpen: false,
    name: null,
    description: null,
    text: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.group.name,
      text: nextProps.group.text
    });
  }

  removeId = () => {
    this.props.removeInterestGroup(this.props.group.id);
  };

  updateId = () => {
    this.props.updateInterestGroup(
      this.props.group.id, this.state.name, this.state.description, this.state.text
    );
  };

  render() {
    const { group } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1 className={styles.detail}>{group.name}</h1>
          <div className={styles.content}>
            <p className={styles.paragraphDetail}>{group.text}</p>
            <Image className={styles.interestPicDetail} src={'https://i.redd.it/dz8mwvl4dgdy.jpg'} />
          </div>
        </div>
        <h2 className={styles.heading}>Kontaktinformasjon</h2>
        <div className={styles.content}>
          <p>
            Martin<br />
            Call me anytime bby gurl, love you long time (30 s confirmed, can provide evidence)
            <br />
            martyboy@alphamale.com
          </p>
          <FlexColumn>
            <div className={styles.button}>
              <Button onClick={() => this.setState({ editorOpen: true })}>Rediger interessegruppe
              </Button>
            </div>
            <div className={styles.button}>
              <Button onClick={this.removeId}>Slett interressegruppe
              </Button>
            </div>
          </FlexColumn>
        </div>

        <FlexRow>
          <div className={styles.button}>
            <Button onClick=''>Bli medlem!</Button>
          </div>
          <div className={styles.button}>
            <Button onClick=''>Kontakt oss</Button>
          </div>
          <div className={styles.button}>
            <Button onClick=''>Facebookgruppe</Button>
          </div>
        </FlexRow>
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
            placeholder='Name'
          />
          <TextEditor
            className={styles.textEditor}
            value={this.state.description}
            onChange={(event) => this.setState({ description: event.target.value })}
            placeholder='Description'
          />
          <TextEditor
            className={styles.textEditor}
            value={this.state.text}
            onChange={(event) => this.setState({ text: event.target.value })}
            placeholder='Text'
          />
          <div className={styles.content}>
            <div>
              <Upload>Last opp bilde</Upload>
            </div>
            <Button onClick={styles.updateId}>Lagre endringer</Button>
          </div>
        </Modal>
      </div>
    );
  }
}
export default InterestGroupDetail;

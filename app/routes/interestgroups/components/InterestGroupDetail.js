import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import Modal from 'app/components/Modal';
import { Button } from 'app/components/Form';
import { FlexColumn, FlexRow } from 'app/components/FlexBox';
import InterestGroupForm from './InterestGroupForm';

class InterestGroupDetail extends Component {
  state = {
    editorOpen: false,
  };

  removeId = () => {
    this.props.removeInterestGroup(this.props.group.id);
  };

  updateId = ({ name, description, text }) => {
    this.props.updateInterestGroup(this.props.group.id, name, description, text);
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
          <InterestGroupForm
            onSubmit={this.updateId}
            buttonText='Rediger interessegruppe'
            header='Rediger interessegruppe'
            group={group}
          />
        </Modal>
      </div>
    );
  }
}
export default InterestGroupDetail;

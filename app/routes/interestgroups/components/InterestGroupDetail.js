import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import Modal from 'app/components/Modal';
import { Button } from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { FlexColumn, FlexRow } from 'app/components/FlexBox';
import InterestGroupForm from './InterestGroupForm';

import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import ProfilePicture from 'app/components/ProfilePicture';

// TODO: this is from the event detail page.
// We can probably move this out to somewhere common.
const RegisteredCell = ({ user }) =>
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={60} user={user} />
    </Link>
  </Tooltip>;

class InterestGroupDetail extends Component {
  state = {
    editorOpen: false
  };

  removeId = () => {
    this.props.removeInterestGroup(this.props.group.id);
  };

  updateId = args => {
    this.props.updateInterestGroup(
      this.props.group.id,
      args
    );
  };

  joinGroup = () => {
    this.props.joinInterestGroup(
      this.props.group.id,
      this.props.currentUser
    )
  };

  leaveGroup = () => {
    const { group: { memberships = []}} = this.props;
    const user = this.props.currentUser.id;
    const membership = memberships.find(m => m.user.id === user);
    this.props.leaveInterestGroup(membership);
  };

  render() {
    const { group, group: { memberships = []}} = this.props;
    const userId = this.props.currentUser.id;
    const isMember = memberships.find(m => m.user.id === userId);
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1 className={styles.detail}>
            {group.name}
          </h1>
          <div className={styles.content}>
            <div>
                <Flex className={styles.registeredThumbnails}>
                  {memberships && memberships
                    .slice(0, 10)
                    .map(reg =>
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    )}
                </Flex>
                <p className={styles.paragraphDetail}>
                  {group.descriptionLong}
                </p>
            </div>
            <Image
              className={styles.interestPicDetail}
              src={group.picture || 'https://i.redd.it/dz8mwvl4dgdy.jpg'}
            />
          </div>
        </div>
        <h2 className={styles.heading}>Kontaktinformasjon</h2>
        <div className={styles.content}>
          <p>
            Martin<br />
            Call me anytime bby gurl, love you long time (30 s confirmed, can
            provide evidence)
            <br />
            martyboy@alphamale.com
          </p>
          <FlexColumn>
            <div className={styles.button}>
              <Button onClick={() => this.setState({ editorOpen: true })}>
                Rediger interessegruppe
              </Button>
            </div>
            <div className={styles.button}>
              <Button onClick={this.removeId}>Slett interressegruppe</Button>
            </div>
          </FlexColumn>
        </div>

        <FlexRow>
          {isMember ?
              (<div className={styles.button}>
                <Button onClick={this.leaveGroup}>Forlat gruppen</Button>
              </div>
              ) :
              (<div className={styles.button}>
                <Button onClick={this.joinGroup}>Bli medlem!</Button>
              </div>
          )}
          <div className={styles.button}>
            <Button onClick="">Kontakt oss</Button>
          </div>
          <div className={styles.button}>
            <Button onClick="">Facebookgruppe</Button>
          </div>
        </FlexRow>
        <Modal
          keyboard={false}
          show={this.state.editorOpen}
          onHide={() => this.setState({ editorOpen: false })}
          closeOnBackdropClick={false}
        >
          <InterestGroupForm
            groupId={group.id}
            onSubmit={this.updateId}
            buttonText="Rediger interessegruppe"
            header="Rediger interessegruppe"
            group={group}
          />
        </Modal>
      </div>
    );
  }
}
export default InterestGroupDetail;

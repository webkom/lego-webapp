// @flow

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import Modal from 'app/components/Modal';
import Time from 'app/components/Time';
import Button from 'app/components/Button';
import EventEditor from './EventEditor';
import { Flex } from 'app/components/Layout';
import styles from './Toolbar.css';

type Props = {
  actionGrant: /*TODO: ActionGrant */ any
};

type State = {
  editorOpen: boolean
};

class Toolbar extends Component<Props, State> {
  state = {
    editorOpen: false
  };

  render() {
    const { actionGrant } = this.props;
    return (
      <Flex wrap className={styles.root}>
        <div className={styles.section}>
          <Time format="ll" className={styles.timeNow} />
        </div>

        <div className={styles.buttons}>
          <IndexLink
            to="/events"
            activeClassName={styles.active}
            className={styles.pickerItem}
          >
            Liste
          </IndexLink>

          <Link
            to="/events/calendar"
            activeClassName={styles.active}
            className={styles.pickerItem}
          >
            Kalender
          </Link>
        </div>

        <div className={styles.section}>
          {actionGrant && actionGrant.includes('create') && (
            <Link to="/events/create">
              <Button>Lag nytt arrangement</Button>
            </Link>
          )}
        </div>

        <Modal
          keyboard={false}
          show={this.state.editorOpen}
          onHide={() => this.setState({ editorOpen: false })}
          closeOnBackdropClick={false}
        >
          <EventEditor />
        </Modal>
      </Flex>
    );
  }
}

export default Toolbar;

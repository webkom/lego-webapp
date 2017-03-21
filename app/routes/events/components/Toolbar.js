// @flow

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import Modal from 'app/components/Modal';
import Time from 'app/components/Time';
import Button from 'app/components/Button';
import EventEditor from './EventEditor';
import styles from './Toolbar.css';

class Toolbar extends Component {
  state = {
    editorOpen: false
  };

  render() {
    const { actionGrant } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.section}>
          <Time format="ll" className={styles.timeNow} />
        </div>

        <div className={styles.buttons}>
          <IndexLink
            to="/events"
            activeClassName={styles.active}
            className={styles.pickerItem}
          >
            List View
          </IndexLink>

          <Link
            to="/events/calendar"
            activeClassName={styles.active}
            className={styles.pickerItem}
          >
            Calendar
          </Link>
        </div>

        <div className={styles.section}>
          {actionGrant &&
            actionGrant.includes('create') &&
            <Button onClick={() => this.setState({ editorOpen: true })}>
              Create Event
            </Button>}
        </div>

        <Modal
          keyboard={false}
          show={this.state.editorOpen}
          onHide={() => this.setState({ editorOpen: false })}
          closeOnBackdropClick={false}
        >
          <EventEditor onClose={() => this.setState({ editorOpen: false })} />
        </Modal>
      </div>
    );
  }
}

export default Toolbar;

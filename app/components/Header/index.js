/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import ButtonTriggeredDropdown from '../ButtonTriggeredDropdown';
import Icon from 'app/components/Icon';
import Search from '../Search';

type Props = {
  searchOpen: boolean;
  toggleSearch: () => any;
};

type State = {
  accountOpen: boolean;
  notificationsOpen: boolean;
};

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    notificationsOpen: false
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <IndexLink to='/' className={styles.logo}>
            <img src='/images/logo_dark.png' />
          </IndexLink>

          <div>
            <div className={styles.navigation}>
              <Link to='/events'>Arrangementer</Link>
              <Link to=''>Karriere</Link>
              <Link to=''>README</Link>
              <Link to='/quotes'>Sitater</Link>

              <div className={styles.buttonGroup}>
                <ButtonTriggeredDropdown
                  buttonClassName={styles.contentButton}
                  contentClassName={styles.dropdown}
                  iconName='bell'
                  show={this.state.notificationsOpen}
                  toggle={() => this.setState({
                    notificationsOpen: !this.state.notificationsOpen
                  })}
                >
                  <h2>No Notifications</h2>
                </ButtonTriggeredDropdown>

                <button
                  className={styles.contentButton}
                  onClick={() => this.props.toggleSearch()}
                  style={{ color: '#c0392b' }}
                >
                  <Icon name='search' />
                </button>
              </div>
            </div>

            <Modal
              show={this.props.searchOpen}
              onHide={() => this.props.toggleSearch()}
              backdropClassName={styles.backdrop}
              backdrop
            >
              <Search
                isOpen={this.state.searchOpen}
                onCloseSearch={() => this.props.toggleSearch()}
              />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}

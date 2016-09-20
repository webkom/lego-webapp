/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import ButtonTriggeredDropdown from '../ButtonTriggeredDropdown';
import Search from '../Search';
import drawFancyNodes from './drawFancyNodes';

type Props = {
  searchOpen: boolean;
  toggleSearch: () => any;
};

type State = {
  accountOpen: boolean;
  notificationsOpen: boolean;
  searchOpen: boolean;
  width: number;
};

const CANVAS_HEIGHT = 160;

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    notificationsOpen: false,
    width: window.innerWidth,
    searchOpen: false
  };

  _canvas: any;

  handleResize = (e: any) => {
    this.setState({
      width: e.target.innerWidth
    });
    this.drawGraphics();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.drawGraphics();
  }

  drawGraphics() {
    const context = this._canvas.getContext('2d');
    drawFancyNodes(context, {
      width: this.state.width,
      height: CANVAS_HEIGHT
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <header className={styles.header}>
        <canvas
          ref={(ref) => { this._canvas = ref; }}
          className={styles.canvas}
          width={this.state.width}
          height={CANVAS_HEIGHT}
        />
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

              <span className={styles.buttonGroup}>
                <ButtonTriggeredDropdown
                  buttonClassName={styles.contentButton}
                  contentClassName={styles.dropdown}
                  iconName='ios-bell'
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
                  <i className='ion-search' />
                </button>
              </span>
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

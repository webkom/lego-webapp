/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import Dropdown from '../Dropdown';
import Search from '../Search';
import drawFancyNodes from './drawFancyNodes';
import logoImage from 'app/assets/logo_dark.png';

type Props = {
  searchOpen: boolean;
  toggleSearch: () => any;
};

type State = {
  accountOpen: boolean;
  notificationsOpen: boolean;
  width: number;
};

const CANVAS_HEIGHT = 160;

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    notificationsOpen: false,
    width: window.innerWidth
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
            <img src={logoImage} />
          </IndexLink>

          <div>
            <div className={styles.navigation}>
              <Link to='/events'>Arrangementer</Link>
              <Link to=''>Karriere</Link>
              <Link to=''>README</Link>
              <Link to='/quotes'>Sitater</Link>

              <div className={styles.buttonGroup}>
                <Dropdown
                  className={styles.contentButton}
                  iconName='ios-bell'
                  show={this.state.notificationsOpen}
                  toggle={() => this.setState({
                    notificationsOpen: !this.state.notificationsOpen
                  })}
                >
                  <h2>No Notifications</h2>
                </Dropdown>

                <button
                  className={styles.contentButton}
                  onClick={() => this.props.toggleSearch()}
                  style={{ color: '#c0392b' }}
                >
                  <i className='ion-search' />
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
                isOpen={this.props.searchOpen}
                onCloseSearch={() => this.props.toggleSearch()}
              />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}

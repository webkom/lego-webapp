import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import SearchBox from '../components/SearchBox';
import LoginBox from '../components/LoginBox';
import Icon from '../components/Icon';

export default class AppContainer extends Component {

  state = {
    menuOpen: false
  }

  render() {
    return (
      <section>
        <header>
          <div className='content'>
            <ul>
              <li className='logo'><Link to='overview'>Abakus</Link></li>
              <li className='search-box'><SearchBox /></li>
              <li className='partner-logo'><a href='http://bekk.no'>Bekk</a></li>
              <li><LoginBox /></li>
            </ul>
          </div>
        </header>

        <nav role='main'>
          <ul className='content'>
            <li><Link to=''>Oversikt</Link></li>
            <li><Link to='events'>Arrangementer</Link></li>
            <li className='expand-menu'>
              <a onClick={this._onToggleMenu} className={this.state.menuOpen ? 'active' : ''}>
                <Icon name={this.state.menuOpen ? 'times' : 'bars'} />
              </a>
            </li>
          </ul>
        </nav>

        <div className='content' style={{position: 'relative'}}>
          <div className={'overlay-menu' + (this.state.menuOpen ? ' open' : '')}>
            {['Karriere', 'BDB', 'Møter', 'Utland', 'Spørreskjema', 'Butikk'].map(function(item, i) {
              return <a href='#' key={i}>{item}</a>;
            })}
          </div>
        </div>

        {this.props.children}

        <footer>
          <p>Abakus er best</p>
        </footer>
      </section>
    );
  }
}

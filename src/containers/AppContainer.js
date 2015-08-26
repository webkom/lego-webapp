import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Overview from '../components/Overview';
import SearchBox from '../components/SearchBox';
import LoginBox from '../components/LoginBox';
import Icon from '../components/Icon';
import { toggleMenu } from '../actions/UIActions';

const MENU_ITEMS = ['Karriere', 'BDB', 'Møter', 'Utland', 'Spørreskjema', 'Butikk'];

@connect(state => ({
  menuOpen: state.ui.menuOpen,
  search: state.search
}))
export default class AppContainer extends Component {

  render() {
    const { dispatch, menuOpen, search } = this.props;
    return (
      <section>
        <header>
          <div className='content'>
            <ul>
              <li className='logo'><Link to='overview'>Abakus</Link></li>
              <li className='search-box'><SearchBox {...{ search, dispatch }}/></li>
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
              <a onClick={() => dispatch(toggleMenu())} className={menuOpen ? 'active' : ''}>
                <Icon name={menuOpen ? 'times' : 'bars'} />
              </a>
            </li>
          </ul>
        </nav>

        <div className='content' style={{position: 'relative'}}>
          {menuOpen && <div className='overlay-menu open'>
            {MENU_ITEMS.map((item, i) => <a href='#' key={i}>{item}</a>)}
          </div>}
        </div>

        {this.props.children || <Overview />}

        <footer>
          <p>Abakus er best</p>
        </footer>
      </section>
    );
  }
}

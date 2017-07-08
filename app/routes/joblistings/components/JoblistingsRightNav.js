import styles from './JoblistingsRightNav.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import CheckBox from 'app/components/Form/CheckBox';

export default class JoblistingsRightNav extends Component {
  static propTypes = {
    query: PropTypes.object.isRequired
  };

  state = {
    filters: {
      class: [],
      jobtypes: [],
      workplaces: []
    }
  };

  componentWillReceiveProps(newProps) {
    const query = newProps.query;
    this.setState({
      filters: {
        class: (query.class || '').split(','),
        jobtypes: (query.jobtypes || '').split(','),
        workplaces: (query.workplaces || '').split(',')
      }
    });
  }

  handleQuery = (type, value, remove = false) => {
    const query = { ...this.props.query };
    if (remove) {
      delete query[type];
    } else {
      query[type] = value;
    }
    return query;
  };

  updateFilters = (type, value) => {
    const filters = this.state.filters;
    let newFilter = {};
    if (filters[type].includes(value)) {
      newFilter = {
        ...filters,
        [type]: [...filters[type].filter(x => x !== value)]
      };
    } else {
      newFilter = {
        ...filters,
        [type]: [...filters[type], value]
      };
    }
    const filterString = {
      class: newFilter.class.toString(),
      jobtypes: newFilter.jobtypes.toString(),
      workplaces: newFilter.workplaces.toString()
    };
    return filterString;
  };

  filterLinkto = (type, value, label) =>
    <Link
      to={{ pathname: '/joblistings', query: this.updateFilters(type, value) }}
      key={value}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckBox checked={this.state.filters[type].includes(value)} readOnly />
        <span style={{ marginLeft: '5px' }}>
          {label}
        </span>
      </div>
    </Link>;

  render() {
    return (
      <FlexColumn className={styles.box}>
        <h3>Sorter etter:</h3>
        <FlexRow className={styles.sort}>
          <Link
            to={{
              pathname: '/joblistings',
              query: this.handleQuery('sort', 'company')
            }}
          >
            Bedrift{' '}
          </Link>
          <Link
            to={{
              pathname: '/joblistings',
              query: this.handleQuery('sort', 'deadline')
            }}
          >
            Frist
          </Link>
        </FlexRow>
        <FlexColumn className={styles.filters}>
          <h3>Klassetrinn:</h3>
          {['1', '2', '3', '4', '5'].map(element =>
            this.filterLinkto('class', element, `${element}. klasse`)
          )}
          <h3>Jobbtype:</h3>
          {this.filterLinkto('jobtypes', 'summer_job', 'Sommerjobb')}
          {this.filterLinkto('jobtypes', 'part_time', 'Deltid')}
          {this.filterLinkto('jobtypes', 'full_time', 'Fulltid')}
          <h3>Sted:</h3>
          {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map(element =>
            this.filterLinkto('workplaces', element, element)
          )}
        </FlexColumn>
      </FlexColumn>
    );
  }
}

// @flow

import styles from './JoblistingRightNav.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import CheckBox from 'app/components/Form/CheckBox';

type Props = {
  query: {
    class: ?string,
    jobtypes: ?string,
    workplaces: ?string
  },
  actionGrant: /*TODO: ActionGrant*/ any
};

export default class JoblistingsRightNav extends Component {
  props: Props;

  state = {
    filters: {
      class: [],
      jobtypes: [],
      workplaces: []
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const query = nextProps.query;
    this.setState({
      filters: {
        class: (query.class || '').split(','),
        jobtypes: (query.jobtypes || '').split(','),
        workplaces: (query.workplaces || '').split(',')
      }
    });
  }

  // $FlowFixMe
  handleQuery = (type, value, remove = false) => {
    const query = { ...this.props.query };
    if (remove) {
      delete query[type];
    } else {
      query[type] = value;
    }
    return query;
  };

  // $FlowFixMe
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

  // $FlowFixMe
  filterLinkto = (type, value, label) => (
    <Link
      to={{ pathname: '/joblistings', query: this.updateFilters(type, value) }}
      key={value}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckBox value={this.state.filters[type].includes(value)} readOnly />
        <span style={{ marginLeft: '5px' }}>{label}</span>
      </div>
    </Link>
  );

  createButton = () => {
    if (this.props.actionGrant.includes('create')) {
      return (
        <FlexRow justifyContent="flex-end" alignItems="center">
          <Link to={`/joblistings/create`}>
            <button className={styles.createButton}>Ny jobbannonse</button>
          </Link>
        </FlexRow>
      );
    }
  };

  render() {
    return (
      <FlexColumn>
        {this.createButton()}
        <FlexRow className={styles.box}>
          <FlexColumn>
            <h3 className={styles.rightHeader}>Sorter etter:</h3>
            <FlexRow className={styles.sort}>
              <Link
                to={{
                  pathname: '/joblistings',
                  query: this.handleQuery('sort', 'company')
                }}
              >
                Bedrift
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
              <h3 className={styles.rightHeader}>Klassetrinn:</h3>
              {['1', '2', '3', '4', '5'].map(element =>
                this.filterLinkto('class', element, `${element}. klasse`)
              )}
              <h3 className={styles.rightHeader}>Jobbtype:</h3>
              {this.filterLinkto('jobtypes', 'summer_job', 'Sommerjobb')}
              {this.filterLinkto('jobtypes', 'part_time', 'Deltid')}
              {this.filterLinkto('jobtypes', 'full_time', 'Fulltid')}
              <h3 className={styles.rightHeader}>Sted:</h3>
              {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map(element =>
                this.filterLinkto('workplaces', element, element)
              )}
            </FlexColumn>
          </FlexColumn>
        </FlexRow>
      </FlexColumn>
    );
  }
}

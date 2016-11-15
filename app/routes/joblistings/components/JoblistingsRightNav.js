import styles from './JoblistingsRightNav.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import CheckBox from 'app/components/Form/CheckBox';

export default class JoblistingsRightNav extends Component {

  state = {
    filters: {
      class: [],
      jobtypes: [],
      workplaces: []
    }
  }

  static propTypes = {
    query: PropTypes.object.isRequired
  };

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
    const filters = { ...this.state.filters };
    let asd = {};
    if (filters[type].includes(value)) {
      asd = {
        ...filters,
        [type]: [
          ...filters[type].filter((x) => x !== value)
        ]
      };
    } else {
      asd = {
        ...filters,
        [type]: [
          ...filters[type],
          value
        ]
      };
    }
    const asd2 = {
      class: asd.class.toString(),
      jobtypes: asd.jobtypes.toString(),
      workplaces: asd.workplaces.toString()
    };
    return asd2;
  }

  componentWillReceiveProps(newProps) {
    const query = { ...newProps.query };
    if (query.class) {
      query.class = query.class.split(',');
    }
    this.setState({ filters: query });
  }

  render() {
    return (
      <FlexColumn className={styles.box}>
        <FlexRow>
          Sorter etter:
        </FlexRow>
        <FlexRow className={styles.sort}>
          <Link to={{ pathname: '/joblistings', query: this.handleQuery('sort', 'company') }}>Bedrift </Link>
          <Link to={{ pathname: '/joblistings', query: this.handleQuery('sort', 'deadline') }}>Frist</Link>
        </FlexRow>
        <FlexColumn>
          <Link to={{ pathname: '/joblistings', query: this.updateFilters('class', '1') }}>
            <CheckBox
              label={'1. klasse'}
              checked={this.state.filters.class.includes('1')}
              readOnly
            />
          </Link>
          <Link to={{ pathname: '/joblistings', query: this.updateFilters('class', '2') }}>
            <CheckBox
              label={'2. klasse'}
              checked={this.state.filters.class.includes('2')}
              readOnly
            />
          </Link>
          <Link to={{ pathname: '/joblistings', query: this.updateFilters('class', '3') }}>
            <CheckBox
              label={'3. klasse'}
              checked={this.state.filters.class.includes('3')}
              readOnly
            />
          </Link>
          <Link to={{ pathname: '/joblistings', query: this.updateFilters('class', '4') }}>
            <CheckBox
              label={'4. klasse'}
              checked={this.state.filters.class.includes('4')}
              readOnly
            />
          </Link>
          <Link to={{ pathname: '/joblistings', query: this.updateFilters('class', '5') }}>
            <CheckBox
              label={'5. klasse'}
              checked={this.state.filters.class.includes('5')}
              readOnly
            />
          </Link>
        </FlexColumn>
      </FlexColumn>
    );
  }
}

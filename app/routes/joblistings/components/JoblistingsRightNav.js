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
    if (query.jobtypes) {
      query.jobtypes = query.jobtypes.split(',');
    }
    if (query.workplaces) {
      query.workplaces = query.workplaces.split(',');
    }
    this.setState({ filters: query });
  }

  asd3 = (type, value, label) => (
    <Link to={{ pathname: '/joblistings', query: this.updateFilters(type, value) }}>
      <CheckBox
        label={label}
        checked={this.state.filters[type].includes(value)}
        readOnly
      />
    </Link>
  );

  render() {
    return (
      <FlexColumn className={styles.box}>
        <h3>Sorter etter:</h3>
        <FlexRow className={styles.sort}>
          <Link to={{ pathname: '/joblistings', query: this.handleQuery('sort', 'company') }}>Bedrift </Link>
          <Link to={{ pathname: '/joblistings', query: this.handleQuery('sort', 'deadline') }}>Frist</Link>
        </FlexRow>
        <FlexColumn className={styles.filters}>
          <h3>Klassetrinn:</h3>
          {['1', '2', '3', '4', '5'].map((element) => this.asd3('class', element, `${element}. klasse`))}
          <h3>Jobbtype:</h3>
          {this.asd3('jobtypes', 'summer_job', 'Sommerjobb')}
          {this.asd3('jobtypes', 'part_time', 'Deltid')}
          {this.asd3('jobtypes', 'full_time', 'Fulltid')}
          <h3>Sted:</h3>
          {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) =>
            this.asd3('workplaces', element, element))}
        </FlexColumn>
      </FlexColumn>
    );
  }
}

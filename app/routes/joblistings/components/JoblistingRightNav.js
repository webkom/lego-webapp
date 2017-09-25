// @flow

import styles from './JoblistingRightNav.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Flex } from 'app/components/Layout';
import { CheckBox, RadioButton } from 'app/components/Form/';
import Button from 'app/components/Button';

const updateFilters = (type, value, filters) => {
  const newFilter = {
    ...filters,
    [type]: filters[type].includes(value)
      ? filters[type].filter(x => x !== value)
      : filters[type].concat(value)
  };
  return {
    ...(newFilter.classNumber.length > 0 && {
      classNumber: newFilter.classNumber.toString()
    }),
    ...(newFilter.jobTypes.length > 0 && {
      jobTypes: newFilter.jobTypes.toString()
    }),
    ...(newFilter.workplaces.length > 0 && {
      workplaces: newFilter.workplaces.toString()
    })
  };
};

const FilterLink = ({ type, label, value, filters }: Object) => (
  <Link
    to={{
      pathname: '/joblistings',
      query: updateFilters(type, value, filters)
    }}
    style={{ display: 'flex', flex: 1, 'align-items': 'center' }}
  >
    <CheckBox id={label} value={filters[type].includes(value)} readOnly />

    <span style={{ marginLeft: '5px' }}> {label}</span>
  </Link>
);

export default class JoblistingsRightNav extends Component {
  props: Props;

  state = {
    filters: {
      classNumber: [],
      jobTypes: [],
      workplaces: []
    },
    order: {
      deadline: true,
      company: false
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const query = nextProps.query;
    this.setState({
      filters: {
        classNumber: query.classNumber ? query.classNumber.split(',') : [],
        jobTypes: query.jobTypes ? query.jobTypes.split(',') : [],
        workplaces: query.workplaces ? query.workplaces.split(',') : []
      },
      order: {
        deadline: query['order'] === 'deadline',
        company: query['order'] === 'company'
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

  render() {
    return (
      <Flex column className={styles.box}>
        {this.props.actionGrant.includes('create') && (
          <Link to={`/joblistings/create`}>
            <Button className={styles.createButton}>Ny jobbannonse</Button>
          </Link>
        )}
        <h3 className={styles.rightHeader}>Sorter etter:</h3>
        <Flex justifyContent="space-around" className={styles.sortNav}>
          <Flex>
            <RadioButton
              name="active"
              id="active"
              inputValue={this.state.order.deadline}
              onChange={() =>
                this.props.router.push({
                  pathname: '/joblistings',
                  query: this.handleQuery('order', 'deadline')
                })}
            />
            <span style={{ marginLeft: '5px' }}>Frist</span>
          </Flex>
          <Flex>
            <RadioButton
              name="active"
              id="inactive"
              inputValue={this.state.order.company}
              onChange={() =>
                this.props.router.push({
                  pathname: '/joblistings',
                  query: this.handleQuery('order', 'company')
                })}
            />
            <span style={{ marginLeft: '5px' }}>Bedrift</span>
          </Flex>
        </Flex>
        <Flex column>
          <h3 className={styles.rightHeader}>Klassetrinn:</h3>
          {['1', '2', '3', '4', '5'].map(element => (
            <FilterLink
              key={element}
              type="classNumber"
              label={`${element}. klasse`}
              value={element}
              filters={this.state.filters}
            />
          ))}
          <h3 className={styles.rightHeader}>Jobbtype:</h3>
          <FilterLink
            type="jobTypes"
            label="Sommerjobb"
            value="summer_job"
            filters={this.state.filters}
          />
          <FilterLink
            type="jobTypes"
            value="part_time"
            label="Deltid"
            filters={this.state.filters}
          />
          <FilterLink
            type="jobTypes"
            value="full_time"
            label="Fulltid"
            filters={this.state.filters}
          />
          <h3 className={styles.rightHeader}>Sted:</h3>
          {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map(element => (
            <FilterLink
              type="workplaces"
              key={element}
              value={element}
              label={element}
              filters={this.state.filters}
            />
          ))}
        </Flex>
      </Flex>
    );
  }
}

// @flow

import styles from './JoblistingRightNav.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBox, RadioButton } from 'app/components/Form/';
import Button from 'app/components/Button';
import cx from 'classnames';
import type { ActionGrant } from 'app/models';
import qs from 'qs';

const updateFilters = (type, value, filters) => {
  const newFilter = {
    ...filters,
    [type]: filters[type].includes(value)
      ? filters[type].filter((x) => x !== value)
      : filters[type].concat(value),
  };
  return {
    ...(newFilter.grades.length > 0
      ? {
          grades: newFilter.grades.toString(),
        }
      : {}),
    //$FlowFixMe[exponential-spread]
    ...(newFilter.jobTypes.length > 0
      ? {
          jobTypes: newFilter.jobTypes.toString(),
        }
      : {}),
    ...(newFilter.workplaces.length > 0
      ? {
          workplaces: newFilter.workplaces.toString(),
        }
      : {}),
  };
};

const FilterLink = ({ type, label, value, filters }: Object) => (
  <Link
    to={{
      pathname: '/joblistings',
      search: qs.stringify(updateFilters(type, value, filters)),
    }}
    className={styles.filterLink}
  >
    <CheckBox id={label} value={filters[type].includes(value)} readOnly />
    {label}
  </Link>
);

type Filter = {
  grades: Array<string>,
  jobTypes: Array<string>,
  workplaces: Array<string>,
};

type Order = {
  deadline: boolean,
  company: boolean,
  createdAt: boolean,
};

type Props = {
  actionGrant: ActionGrant,
  query: {
    grades: string,
    jobTypes: string,
    workplaces: string,
    order: string,
  },
  history: any,
};

const JoblistingsRightNav = (props: Props) => {
  const [filters, setFilters] = useState<Filter>({
    grades: [],
    jobTypes: [],
    workplaces: [],
  });
  const [order, setOrder] = useState<Order>({
    deadline: true,
    company: false,
    createdAt: false,
  });
  const [displayOptions, setDisplayOptions] = useState<boolean>(true);

  useEffect(() => {
    const query = props.query;
    setFilters({
      grades: query.grades ? query.grades.split(',') : [],
      jobTypes: query.jobTypes ? query.jobTypes.split(',') : [],
      workplaces: query.workplaces ? query.workplaces.split(',') : [],
    });
    setOrder({
      deadline:
        query.order === 'deadline' || !Object.keys(query).includes('order'),
      company: query.order === 'company',
      createdAt: query.order === 'createdAt',
    });
  }, [props.query]);

  const handleQuery = (
    type: string,
    value: string,
    remove: boolean = false
  ) => {
    const query = { ...props.query };
    if (remove) {
      delete query[type];
    } else {
      query[type] = value;
    }
    return query;
  };

  return (
    <div className={styles.joblistingRightNav}>
      <Button
        flat
        onClick={() => setDisplayOptions(!displayOptions)}
        className={styles.optionsTitle}
      >
        <h2>
          Valg
          <i
            className={cx(
              'fa fa-caret-down',
              !displayOptions && styles.rotateCaret
            )}
          />
        </h2>
      </Button>

      <div
        className={styles.options}
        style={{ display: displayOptions ? 'block' : 'none' }}
      >
        {props.actionGrant.includes('create') && (
          <Link to="/joblistings/create">
            <Button className={styles.createButton}>Ny jobbannonse</Button>
          </Link>
        )}

        <h3 className={styles.rightHeader}>Sorter etter:</h3>
        <label htmlFor="deadline" style={{ cursor: 'pointer' }}>
          <RadioButton
            name="sort"
            id="deadline"
            inputValue={true}
            value={order.deadline}
            onChange={() => {
              props.history.push({
                pathname: '/joblistings',
                search: qs.stringify(handleQuery('order', 'deadline')),
              });
            }}
          />
          Frist
        </label>
        <label htmlFor="company" style={{ cursor: 'pointer' }}>
          <RadioButton
            name="sort"
            id="company"
            inputValue={true}
            value={order.company}
            onChange={() => {
              props.history.push({
                pathname: '/joblistings',
                search: qs.stringify(handleQuery('order', 'company')),
              });
            }}
          />
          Bedrift
        </label>
        <label htmlFor="createdAt" style={{ cursor: 'pointer' }}>
          <RadioButton
            name="sort"
            id="createdAt"
            inputValue={true}
            value={order.createdAt}
            onChange={() => {
              props.history.push({
                pathname: '/joblistings',
                search: qs.stringify(handleQuery('order', 'createdAt')),
              });
            }}
          />
          Publisert
        </label>

        <h3 className={styles.rightHeader}>Klassetrinn:</h3>
        {['1', '2', '3', '4', '5'].map((element) => (
          <FilterLink
            key={element}
            type="grades"
            label={`${element}. klasse`}
            value={element}
            filters={filters}
          />
        ))}

        <h3 className={styles.rightHeader}>Jobbtype:</h3>
        <FilterLink
          type="jobTypes"
          label="Sommerjobb"
          value="summer_job"
          filters={filters}
        />
        <FilterLink
          type="jobTypes"
          value="part_time"
          label="Deltid"
          filters={filters}
        />
        <FilterLink
          type="jobTypes"
          value="full_time"
          label="Fulltid"
          filters={filters}
        />
        <FilterLink
          type="jobTypes"
          value="master_thesis"
          label="Masteroppgave"
          filters={filters}
        />
        <FilterLink
          type="jobTypes"
          value="other"
          label="Annet"
          filters={filters}
        />

        <h3 className={styles.rightHeader}>Sted:</h3>
        {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) => (
          <FilterLink
            type="workplaces"
            key={element}
            value={element}
            label={element}
            filters={filters}
          />
        ))}
      </div>
    </div>
  );
};

export default JoblistingsRightNav;

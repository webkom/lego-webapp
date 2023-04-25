import cx from 'classnames';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { CheckBox, RadioButton } from 'app/components/Form/';
import type { JobType } from 'app/components/JoblistingItem/Items';
import type { ActionGrant } from 'app/models';
import { jobTypes } from '../constants';
import styles from './JoblistingRightNav.css';

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

const FilterLink = ({
  type,
  label,
  value,
  filters,
  history,
}: Record<string, any>) => {
  const handleChange = () => {
    const location = {
      pathname: '/joblistings',
      search: qs.stringify(updateFilters(type, value, filters)),
    };
    history.push(location);
  };

  return (
    <CheckBox
      id={label}
      label={label}
      value={filters[type].includes(value)}
      onChange={handleChange}
      readOnly
    />
  );
};

type Filter = {
  grades: Array<string>;
  jobTypes: JobType[];
  workplaces: Array<string>;
};
type Order = {
  deadline: boolean;
  company: boolean;
  createdAt: boolean;
};
type Props = {
  actionGrant: ActionGrant;
  query: {
    grades?: string;
    jobTypes?: string;
    workplaces?: string;
    order?: string;
  };
  history: any;
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
      jobTypes: query.jobTypes ? (query.jobTypes.split(',') as JobType[]) : [],
      workplaces: query.workplaces ? query.workplaces.split(',') : [],
    });
    setOrder({
      deadline:
        query.order === 'deadline' || !Object.keys(query).includes('order'),
      company: query.order === 'company',
      createdAt: query.order === 'createdAt',
    });
  }, [props.query]);

  const handleQuery = (type: string, value: string, remove = false) => {
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
        style={{
          display: displayOptions ? 'block' : 'none',
        }}
      >
        {props.actionGrant.includes('create') && (
          <Link to="/joblistings/create">
            <Button>Ny jobbannonse</Button>
          </Link>
        )}
        <h3 className={styles.rightHeader}>Sorter etter:</h3>
        <label
          htmlFor="deadline"
          style={{
            cursor: 'pointer',
          }}
        >
          <RadioButton
            name="sort"
            id="deadline"
            checked={order.deadline}
            onChange={() => {
              props.history.push({
                pathname: '/joblistings',
                search: qs.stringify(handleQuery('order', 'deadline')),
              });
            }}
          />
          Frist
        </label>
        <label
          htmlFor="company"
          style={{
            cursor: 'pointer',
          }}
        >
          <RadioButton
            name="sort"
            id="company"
            checked={order.company}
            onChange={() => {
              props.history.push({
                pathname: '/joblistings',
                search: qs.stringify(handleQuery('order', 'company')),
              });
            }}
          />
          Bedrift
        </label>
        <label
          htmlFor="createdAt"
          style={{
            cursor: 'pointer',
          }}
        >
          <RadioButton
            name="sort"
            id="createdAt"
            checked={order.createdAt}
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
            history={props.history}
          />
        ))}

        <h3 className={styles.rightHeader}>Jobbtype:</h3>
        {jobTypes.map((el) => {
          return (
            <FilterLink
              key={el.value}
              type="jobTypes"
              value={el.value}
              label={el.label}
              filters={filters}
              history={props.history}
            />
          );
        })}

        <h3 className={styles.rightHeader}>Sted:</h3>
        {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) => (
          <FilterLink
            key={element}
            type="workplaces"
            value={element}
            label={element}
            filters={filters}
            history={props.history}
          />
        ))}
      </div>
    </div>
  );
};

export default JoblistingsRightNav;

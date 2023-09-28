import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom-v5-compat';
import { CheckBox, RadioButton } from 'app/components/Form/';
import type { JobType } from 'app/components/JoblistingItem/Items';
import { useAppSelector } from 'app/store/hooks';
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

const FilterLink = ({ type, label, value, filters }: Record<string, any>) => {
  const navigate = useNavigate();

  const handleChange = () => {
    navigate(
      `/joblistings?${qs.stringify(updateFilters(type, value, filters))}`
    );
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
  query: {
    grades?: string;
    jobTypes?: string;
    workplaces?: string;
    order?: string;
  };
};

const JoblistingsRightNav = ({ query }: Props) => {
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

  const navigate = useNavigate();

  const actionGrant = useAppSelector((state) => state.joblistings.actionGrant);

  useEffect(() => {
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
  }, [query]);

  const handleQuery = (type: string, value: string, remove = false) => {
    const newQuery = { ...query };

    if (remove) {
      delete newQuery[type];
    } else {
      newQuery[type] = value;
    }

    return newQuery;
  };

  return (
    <div className={styles.joblistingRightNav}>
      <button
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
      </button>

      <div
        className={styles.options}
        style={{
          display: displayOptions ? 'block' : 'none',
        }}
      >
        {actionGrant.includes('create') && (
          <Link to="/joblistings/create">
            <Button>Ny jobbannonse</Button>
          </Link>
        )}

        <h3 className={styles.rightHeader}>Sorter etter</h3>
        <RadioButton
          name="sort"
          id="deadline"
          label="Frist"
          checked={order.deadline}
          onChange={() => {
            navigate(
              `/joblistings?${qs.stringify(handleQuery('order', 'deadline'))}`
            );
          }}
        />
        <RadioButton
          name="sort"
          id="company"
          label="Bedrift"
          checked={order.company}
          onChange={() => {
            navigate(
              `/joblistings?${qs.stringify(handleQuery('order', 'company'))}`
            );
          }}
        />
        <RadioButton
          name="sort"
          id="createdAt"
          label="Publisert"
          checked={order.createdAt}
          onChange={() => {
            navigate(
              `/joblistings?${qs.stringify(handleQuery('order', 'createdAt'))}`
            );
          }}
        />

        <h3 className={styles.rightHeader}>Klassetrinn</h3>
        {['1', '2', '3', '4', '5'].map((element) => (
          <FilterLink
            key={element}
            type="grades"
            label={`${element}. klasse`}
            value={element}
            filters={filters}
          />
        ))}
        <h3 className={styles.rightHeader}>Jobbtype</h3>
        {jobTypes.map((el) => {
          return (
            <FilterLink
              key={el.value}
              type="jobTypes"
              value={el.value}
              label={el.label}
              filters={filters}
            />
          );
        })}
        <h3 className={styles.rightHeader}>Sted</h3>
        {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) => (
          <FilterLink
            key={element}
            type="workplaces"
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

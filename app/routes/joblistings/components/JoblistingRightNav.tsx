import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import qs from 'qs';
import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom-v5-compat';
import { CheckBox, RadioButton } from 'app/components/Form/';
import type { JobType } from 'app/components/JoblistingItem/Items';
import { useAppSelector } from 'app/store/hooks';
import { jobTypes } from '../constants';
import styles from './JoblistingRightNav.css';

const updateFilters = (type, value, filters) => {
  const updatedFilters = {
    ...filters,
    [type]: filters[type].includes(value)
      ? filters[type].filter((x) => x !== value)
      : [...filters[type], value],
  };

  const filterKeys = ['grades', 'jobTypes', 'workplaces'];

  return filterKeys.reduce((acc, key) => {
    if (updatedFilters[key].length > 0) {
      acc[key] = updatedFilters[key].toString();
    }
    return acc;
  }, {});
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

type Props = {
  query: {
    grades?: string;
    jobTypes?: string;
    workplaces?: string;
    order?: string;
  };
};

const JoblistingsRightNav = ({ query }: Props) => {
  const [displayOptions, setDisplayOptions] = useState<boolean>(true);

  const navigate = useNavigate();

  const actionGrant = useAppSelector((state) => state.joblistings.actionGrant);

  const filters = useMemo(() => {
    return {
      grades: query.grades ? query.grades.split(',') : [],
      jobTypes: query.jobTypes ? (query.jobTypes.split(',') as JobType[]) : [],
      workplaces: query.workplaces ? query.workplaces.split(',') : [],
    };
  }, [query]);

  const order = useMemo(() => {
    return {
      deadline:
        query.order === 'deadline' || !Object.keys(query).includes('order'),
      company: query.order === 'company',
      createdAt: query.order === 'createdAt',
    };
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
        {jobTypes.map((el) => (
          <FilterLink
            key={el.value}
            type="jobTypes"
            value={el.value}
            label={el.label}
            filters={filters}
          />
        ))}
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

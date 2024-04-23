import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBox, RadioButton } from 'app/components/Form/';
import { useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import { jobTypes as allJobTypes, yearValues } from '../constants';
import { defaultJoblistingsQuery } from './JoblistingPage';
import styles from './JoblistingRightNav.css';

const JoblistingsRightNav = () => {
  const { query, setQueryValue } = useQuery(defaultJoblistingsQuery);
  const { order, grades, jobTypes, workplaces } = query;

  const [displayOptions, setDisplayOptions] = useState<boolean>(true);

  const actionGrant = useAppSelector((state) => state.joblistings.actionGrant);

  return (
    <div className={styles.joblistingRightNav}>
      <button
        onClick={() => setDisplayOptions(!displayOptions)}
        className={styles.optionsTitle}
      >
        <h2>Valg</h2>
        <i
          className={cx(
            'fa fa-caret-down',
            !displayOptions && styles.rotateCaret,
          )}
        />
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

        <h4 className={styles.rightHeader}>Sorter etter</h4>
        <RadioButton
          name="sort"
          id="deadline"
          label="Frist"
          checked={order === 'deadline'}
          onChange={() => {
            setQueryValue('order')('deadline');
          }}
        />
        <RadioButton
          name="sort"
          id="company"
          label="Bedrift"
          checked={order === 'company'}
          onChange={() => {
            setQueryValue('order')('company');
          }}
        />
        <RadioButton
          name="sort"
          id="createdAt"
          label="Publisert"
          checked={order === 'createdAt'}
          onChange={() => {
            setQueryValue('order')('createdAt');
          }}
        />

        <h4 className={styles.rightHeader}>Klassetrinn</h4>
        {yearValues.map((year) => (
          <FilterCheckbox
            key={year.value}
            value={String(year.value)}
            label={year.label}
            activeFilters={grades}
            onChange={setQueryValue('grades')}
          />
        ))}

        <h4 className={styles.rightHeader}>Jobbtype</h4>
        {allJobTypes.map((element) => {
          return (
            <FilterCheckbox
              key={element.value}
              value={element.value}
              label={element.label}
              activeFilters={jobTypes}
              onChange={setQueryValue('jobTypes')}
            />
          );
        })}

        <h4 className={styles.rightHeader}>Sted</h4>
        {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) => (
          <FilterCheckbox
            key={element}
            value={element}
            label={element}
            activeFilters={workplaces}
            onChange={setQueryValue('workplaces')}
          />
        ))}
      </div>
    </div>
  );
};

type FilterCheckboxProps = {
  value: string;
  label: string;
  activeFilters: string[];
  onChange: (activeFilters: string[]) => void;
};
const FilterCheckbox = ({
  value,
  label,
  activeFilters,
  onChange,
}: FilterCheckboxProps) => (
  <CheckBox
    id={value}
    label={label}
    checked={activeFilters.includes(value)}
    onChange={() =>
      onChange(
        activeFilters.includes(value)
          ? activeFilters.filter((e) => e !== value)
          : [...activeFilters, value].sort(),
      )
    }
    readOnly
  />
);

export default JoblistingsRightNav;

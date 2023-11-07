import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBox, RadioButton } from 'app/components/Form/';
import type { ActionGrant } from 'app/models';
import { defaultJoblistingsQuery } from 'app/routes/joblistings/JoblistingRoute';
import useQuery from 'app/utils/useQuery';
import { jobTypes as allJobTypes } from '../constants';
import styles from './JoblistingRightNav.css';

type Props = {
  actionGrant: ActionGrant;
};

const JoblistingsRightNav = (props: Props) => {
  const { query, setQueryValue } = useQuery(defaultJoblistingsQuery);

  const { order, grades, jobTypes, workplaces } = query;

  const [displayOptions, setDisplayOptions] = useState<boolean>(true);

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
        {props.actionGrant.includes('create') && (
          <Link to="/joblistings/create">
            <Button>Ny jobbannonse</Button>
          </Link>
        )}

        <h3 className={styles.rightHeader}>Sorter etter</h3>
        <RadioButton
          name="sort"
          id="deadline"
          label="Frist"
          checked={order === 'deadline'}
          onChange={(value) => {
            console.log(value);
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

        <h3 className={styles.rightHeader}>Klassetrinn</h3>
        {['1', '2', '3', '4', '5'].map((element) => (
          <FilterCheckbox
            key={element}
            value={element}
            label={element}
            activeFilters={grades}
            onChange={setQueryValue('grades')}
          />
        ))}
        <h3 className={styles.rightHeader}>Jobbtype</h3>
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
        <h3 className={styles.rightHeader}>Sted</h3>
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
          : [...activeFilters, value].sort()
      )
    }
    readOnly
  />
);

export default JoblistingsRightNav;

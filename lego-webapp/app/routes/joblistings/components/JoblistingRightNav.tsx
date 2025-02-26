import { FilterSection } from '@webkom/lego-bricks';
import { CheckBox, RadioButton } from '~/components/Form/';
import useQuery from '~/utils/useQuery';
import { jobTypes as allJobTypes, yearValues } from '../constants';
import { defaultJoblistingsQuery } from './JoblistingPage';

const JoblistingFilters = () => {
  const { query, setQueryValue } = useQuery(defaultJoblistingsQuery);
  const { order, grades, jobTypes, workplaces } = query;

  return (
    <>
      <FilterSection title="Sorter etter">
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
      </FilterSection>
      <FilterSection title="Klassetrinn">
        {yearValues.map((year) => (
          <FilterCheckbox
            key={year.value}
            value={String(year.value)}
            label={year.label}
            activeFilters={grades}
            onChange={setQueryValue('grades')}
          />
        ))}
      </FilterSection>
      <FilterSection title="Jobbtype">
        {allJobTypes.map((element) => (
          <FilterCheckbox
            key={element.value}
            value={element.value}
            label={element.label}
            activeFilters={jobTypes}
            onChange={setQueryValue('jobTypes')}
          />
        ))}
      </FilterSection>
      <FilterSection title="Sted">
        {['Oslo', 'Trondheim', 'Bergen', 'Tromsø', 'Annet'].map((element) => (
          <FilterCheckbox
            key={element}
            value={element}
            label={element}
            activeFilters={workplaces}
            onChange={setQueryValue('workplaces')}
          />
        ))}
      </FilterSection>
    </>
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

export default JoblistingFilters;

import { Icon, FilterSection } from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  TentTree,
  Camera,
  Guitar,
  Speaker,
  Armchair,
  FileQuestion,
} from 'lucide-react';
import ComponentAsCheckBox from '../../components/Form/ComponentAsCheckBox';
import TextInput from '../../components/Form/TextInput';
import {
  LENDABLE_CATEGORY,
  FilterLendingCategory,
} from '../../utils/constants';
import styles from './FilterSearch.module.css';
import type { ReactNode } from 'react';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  selected: FilterLendingCategory[];
  onToggle: (category: FilterLendingCategory) => () => void;
};

const categoryIconMap: Record<FilterLendingCategory, ReactNode> = {
  outdoors: <TentTree />,
  photography: <Camera />,
  instrument: <Guitar />,
  speaker: <Speaker />,
  furniture: <Armchair />,
  other: <FileQuestion />,
};

const FilterSearch = ({
  search,
  onSearchChange,
  selected,
  onToggle,
}: Props) => {
  return (
    <FilterSection title="">
      <TextInput
        prefix="search"
        placeholder="Grill, soundboks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.filterCategoryContainer}>
        {Object.entries(LENDABLE_CATEGORY).map(([category, value]) => (
          <ComponentAsCheckBox
            name="category"
            id={category}
            key={category}
            label={value}
            component={({ checked, focused }) => (
              <Icon
                iconNode={categoryIconMap[category as FilterLendingCategory]}
                size={32}
                className={cx(
                  checked && styles.checked,
                  focused && styles.focused,
                )}
              />
            )}
            checked={selected.includes(category as FilterLendingCategory)}
            onChange={onToggle(category as FilterLendingCategory)}
          />
        ))}
      </div>
    </FilterSection>
  );
};

export default FilterSearch;

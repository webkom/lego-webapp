import { Icon, FilterSection } from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  TentTree,
  Camera,
  Guitar,
  Speaker,
  Armchair,
  Boxes,
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
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

export const categoryIconMap: Record<FilterLendingCategory, ReactNode> = {
  outdoors: <TentTree />,
  photography: <Camera />,
  instrument: <Guitar />,
  speaker: <Speaker />,
  furniture: <Armchair />,
  other: <Boxes />,
};

const FilterSearch = ({
  search,
  onSearchChange,
  selected,
  onToggle,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const checkScroll = () => {
    const element = scrollRef.current;
    if (element) {
      setShowLeftShadow(element.scrollLeft > 0);
      setShowRightShadow(
        Math.ceil(element.scrollLeft) <
          element.scrollWidth - element.clientWidth - 1,
      );
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll();
    }

    return () => {
      element?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <FilterSection title="">
      <TextInput
        prefix="search"
        placeholder="Grill, soundboks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.textInput}
      />
      <div
        className={cx(
          styles.filterCategoryWrapper,
          showLeftShadow && styles.showLeftShadow,
          showRightShadow && styles.showRightShadow,
        )}
      >
        <div ref={scrollRef} className={styles.filterCategoryContainer}>
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
      </div>
    </FilterSection>
  );
};

export default FilterSearch;

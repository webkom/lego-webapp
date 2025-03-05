import { Flex } from '@webkom/lego-bricks';
import { isNotNullish } from '~/utils';
import styles from './styles.module.css';
import type { ReactNode } from 'react';

type Item = {
  key: string;
  keyNode?: ReactNode;
  value: ReactNode;
};
type Props = {
  items: Array<Item | null | undefined>;
  className?: string;
};

/**
 * Renders a list of key/value info pairs, e.g.:
 * Location <strong>Oslo</strong>
 * Time <strong>Yesterday</strong>
 */
const InfoList = ({ items, className }: Props) => {
  return (
    <Flex column gap="var(--spacing-sm)" className={className}>
      {items.filter(isNotNullish).map(({ key, keyNode, value }) => (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="var(--spacing-md)"
          key={key}
        >
          {keyNode ?? <span>{key}</span>}

          <span className={styles.value}>{value}</span>
        </Flex>
      ))}
    </Flex>
  );
};

export default InfoList;

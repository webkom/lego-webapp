import { TextInput } from 'app/components/Form';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import styles from './ReactionPickerFooter.css';

type Props = {
  onSearch: (searchString: string) => void;
};

const ReactionPickerFooter = ({ onSearch }: Props) => (
  <div className={styles.reactionPickerFooter}>
    <Flex alignItems="center" className={styles.search}>
      <Icon name="search" size={16} />
      <TextInput
        type="text"
        placeholder="Søk ..."
        maxLength={15}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          return onSearch(target.value);
        }}
      />
    </Flex>
  </div>
);

export default ReactionPickerFooter;

import { Search } from 'lucide-react';
import { TextInput } from '~/components/Form';
import styles from './ReactionPickerFooter.module.css';

type Props = {
  onSearch: (searchString: string) => void;
};

const ReactionPickerFooter = ({ onSearch }: Props) => (
  <div className={styles.reactionPickerFooter}>
    <TextInput
      type="text"
      prefixIconNode={<Search />}
      placeholder="Søk ..."
      maxLength={15}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        return onSearch(target.value);
      }}
    />
  </div>
);

export default ReactionPickerFooter;

import { TextInput } from 'app/components/Form';
import styles from './ReactionPickerFooter.css';

type Props = {
  onSearch: (searchString: string) => void;
};

const ReactionPickerFooter = ({ onSearch }: Props) => (
  <div className={styles.reactionPickerFooter}>
    <TextInput
      type="text"
      prefix="search"
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

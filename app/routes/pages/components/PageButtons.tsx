import { Button } from '@webkom/lego-bricks';
import styles from './PageButtons.css';

type Props = {
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => void;
};

const PageButtons = ({ isEditing, toggleEditing, handleSave }: Props) => (
  <div>
    <Button flat={isEditing} onClick={toggleEditing}>
      {isEditing ? 'Avbryt' : 'Rediger'}
    </Button>
    {isEditing && (
      <Button secondary onClick={handleSave} className={styles.last}>
        Lagre
      </Button>
    )}
  </div>
);

export default PageButtons;

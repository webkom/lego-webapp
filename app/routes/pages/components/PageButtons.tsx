import Button from 'app/components/Button';
import styles from './PageButtons.module.css';

type Props = {
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => void;
};

const PageButtons = ({ isEditing, toggleEditing, handleSave }: Props) => (
  <div>
    <Button size="small" onClick={toggleEditing}>
      {isEditing ? 'Avbryt' : 'Rediger'}
    </Button>
    {isEditing && (
      <Button size="small" onClick={handleSave} className={styles.last}>
        Lagre
      </Button>
    )}
  </div>
);

export default PageButtons;

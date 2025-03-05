import styles from './index.module.css';

type Props = {
  unicodeString: string;
  shortCode?: string;
  size?: string;
};

const Emoji = ({ unicodeString, size = 'inherit' }: Props) => {
  return (
    <div
      className={styles.emoji}
      style={{
        height: size,
        width: size,
        fontSize: size,
      }}
    >
      {unicodeString}
    </div>
  );
};

export default Emoji;

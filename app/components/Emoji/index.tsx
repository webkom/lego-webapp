import styles from "./index.css";
type Props = {
  unicodeString: string;
  shortCode?: string;
  size?: string;
};

const Emoji = ({
  shortCode,
  unicodeString,
  size = 'inherit'
}: Props) => {
  return <div className={styles.emoji} alt={shortCode} style={{
    height: size,
    width: size,
    fontSize: size
  }}>
      {unicodeString}
    </div>;
};

export default Emoji;
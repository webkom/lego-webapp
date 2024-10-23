import { Image } from '@webkom/lego-bricks';
import { readmeIfy } from 'app/components/ReadmeLogo';
import styles from './EmailItem.module.css';

type Props = {
  email: string;
  logo?: any;
  recipient: string;
};

const EmailItem = ({ email, logo, recipient }: Props) => {
  return (
    <div className={styles.container}>
      {logo && (
        <Image
          className={styles.logo}
          src={logo}
          alt={`${recipient} sin logo`}
        />
      )}
      <div>
        <div className={styles.recipient}>{readmeIfy(recipient)}</div>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </div>
  );
};

export default EmailItem;

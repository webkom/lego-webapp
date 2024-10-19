import styles from './MazemapEmbed.css';

type Props = {
  mazemapPoi: number;
  linkText?: string;
};

const MazemapLink = ({ mazemapPoi, linkText }: Props) => (
  <a
    href={
      'https://use.mazemap.com/#v=1&sharepoitype=poi&campusid=1&sharepoi=' +
      mazemapPoi
    }
    rel="noreferrer noopener"
    target="_blank"
    className={styles.mazemapLink}
  >
    {linkText || 'Åpne kart i ny fane'}
  </a>
);

export default MazemapLink;

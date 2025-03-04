import { Icon } from '@webkom/lego-bricks';
import { LucideSquareArrowOutUpRight } from 'lucide-react';
import { Link } from 'react-router';
import styles from './MazemapEmbed.module.css';
import type { CSSProperties } from 'react';

type Props = {
  mazemapPoi: number;
  linkText?: string;
  style?: CSSProperties;
  iconOnly?: boolean;
};

const MazemapLink = ({ mazemapPoi, linkText, style, iconOnly }: Props) => (
  <Link
    to={
      'https://use.mazemap.com/#v=1&sharepoitype=poi&campusid=1&sharepoi=' +
      mazemapPoi
    }
    rel="noreferrer noopener"
    target="_blank"
    className={styles.mazemapLink}
    style={style}
  >
    <Icon iconNode={<LucideSquareArrowOutUpRight />} size={19} />
    {!iconOnly && (linkText || 'Åpne kart i ny fane')}
  </Link>
);

export default MazemapLink;

import { Icon, Tooltip } from '@webkom/lego-bricks';
import { LoaderCircle, Radio, Unplug } from 'lucide-react';
import styles from './WebsocketStatus.module.css';

type Props = {
  connected: boolean;
  pending: boolean;
};

const WebsocketStatus = ({ connected, pending }: Props) => {
  const iconNode = connected ? (
    <Radio />
  ) : pending ? (
    <LoaderCircle className={styles.spin} />
  ) : (
    <Unplug />
  );

  const tooltipContent = connected
    ? 'Kommentarfeltet er live. Du trenger ikke refreshe for å se andre oppdateringer.'
    : 'Kommentarfeltet er ikke live. Du må refresh for å få andre oppdateringer.';

  return (
    <Tooltip content={tooltipContent}>
      <div className={styles.wsStatusIcon}>
        <Icon iconNode={iconNode} size={20} />
      </div>
    </Tooltip>
  );
};

export default WebsocketStatus;

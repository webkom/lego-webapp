import { Icon, Tooltip } from '@webkom/lego-bricks';
import { LoaderCircle, Radio, Unplug } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { WebsocketsStatus as WebsocketsStatusType } from '~/redux/models/Websockets';
import { STATUS_ERROR } from '~/redux/slices/websockets';
import styles from './WebsocketStatus.module.css';

type ChildrenProps = {
  WebsocketStatus: () => ReactNode;
  connected: boolean;
  pending: boolean;
  error: boolean;
};

type Props = {
  group: string;
  children: (props: ChildrenProps) => ReactNode;
};

const WebsocketGroupProvider = ({ group, children }: Props) => {
  const dispatch = useAppDispatch();
  const websocketsStatus: WebsocketsStatusType = useAppSelector(
    (state) => state.websockets.status,
  );
  const groupStatus =
    useAppSelector(
      (state) => state.websockets.groups.find((g) => g.group === group)?.status,
    ) || STATUS_ERROR;

  const status = {
    connected: websocketsStatus.connected && groupStatus.connected,
    pending: websocketsStatus.pending || groupStatus.pending,
    error: websocketsStatus.error || groupStatus.error,
  };
  // Ensure proper order of connection
  useEffect(() => {
    if (websocketsStatus.connected && !websocketsStatus.error) {
      dispatch({
        type: WebsocketsAT.GROUP_JOIN.BEGIN,
        payload: { group: group },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websocketsStatus.connected, websocketsStatus.error]);

  // Clean up
  useEffect(() => {
    return () => {
      if (websocketsStatus.connected && !websocketsStatus.error) {
        dispatch({
          type: WebsocketsAT.GROUP_LEAVE.BEGIN,
          payload: { group: group },
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const WebsocketsStatusComponent = () => {
    const iconNode = status?.connected ? (
      <Radio />
    ) : status?.pending ? (
      <LoaderCircle className={styles.spin} />
    ) : (
      <Unplug />
    );

    const tooltipContent = groupStatus?.connected
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

  return children({
    WebsocketStatus: () => <WebsocketsStatusComponent />,
    ...status,
  });
};

export default WebsocketGroupProvider;

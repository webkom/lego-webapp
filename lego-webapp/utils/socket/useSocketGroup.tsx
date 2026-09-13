import { useEffect, useState } from 'react';
import WebsocketStatusIcon from '~/components/WebsocketStatus';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useTransientSocketEvent } from '~/utils/socket/useTransientSocketEvent';

const subscriberCounts = new Map<string, number>();

type Status = { connected: boolean; pending: boolean; error: boolean };
type GroupPayload = { group: string }

const STATUS_INITIAL: Status = { connected: false, pending: false, error: false };
const STATUS_CONNECTED: Status = { ...STATUS_INITIAL, connected: true };
const STATUS_PENDING: Status = { ...STATUS_INITIAL, pending: true };
const STATUS_ERROR: Status = { ...STATUS_INITIAL, error: true };

/**
 * Subscribes to a server-side websocket group enabling this client to recieve
 * messages broadcasted over this group. This hook does however not return any
 * of said messages, get this through standard redux selectors.
 */
const useSocketGroup = (group: string) => {
  const dispatch = useAppDispatch();
  const socketStatus = useAppSelector((state) => state.websockets);
  const [groupStatus, setGroupStatus] = useState<Status>(STATUS_ERROR);

  useTransientSocketEvent<GroupPayload>(
    WebsocketsAT.GROUP_JOIN.SUCCESS,
    (payload) => {
      if (payload?.group === group) setGroupStatus(STATUS_CONNECTED);
    },
  );
  useTransientSocketEvent<GroupPayload>(
    WebsocketsAT.GROUP_JOIN.FAILURE,
    (payload) => {
      if (payload?.group === group) setGroupStatus(STATUS_ERROR);
    },
  );
  useTransientSocketEvent<GroupPayload>(
    WebsocketsAT.GROUP_LEAVE.SUCCESS,
    (payload) => {
      if (payload?.group === group) setGroupStatus(STATUS_INITIAL);
    },
  );

  const status = {
    connected: socketStatus.connected && groupStatus.connected,
    pending: groupStatus.pending,
    error: socketStatus.error || groupStatus.error,
  };

  // Join whenever the socket is connected.
  useEffect(() => {
    if (socketStatus.connected && !socketStatus.error) {
      setGroupStatus(STATUS_PENDING);
      dispatch({ type: WebsocketsAT.GROUP_JOIN.BEGIN, payload: { group } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, socketStatus.connected, socketStatus.error]);

  // Leave only once the last consumer of this group unmounts.
  useEffect(() => {
    subscriberCounts.set(group, (subscriberCounts.get(group) ?? 0) + 1);

    return () => {
      const remaining = (subscriberCounts.get(group) ?? 1) - 1;
      subscriberCounts.set(group, remaining);
      if (remaining === 0) {
        dispatch({ type: WebsocketsAT.GROUP_LEAVE.BEGIN, payload: { group } });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  return {
    ...status,
    WebsocketStatus: () => (
      <WebsocketStatusIcon
        connected={status.connected}
        pending={status.pending}
      />
    ),
  };
};

export default useSocketGroup;

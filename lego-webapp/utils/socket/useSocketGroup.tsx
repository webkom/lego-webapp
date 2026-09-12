import { useEffect } from 'react';
import WebsocketStatusIcon from '~/components/WebsocketStatus';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { STATUS_ERROR } from '~/redux/slices/websockets';

const subscriberCounts = new Map<string, number>();

/**
 * Subscribes to a server-side websocket group enabling this client to recieve
 * messages broadcasted over this group. This hook does however not return any
 * of said messages, get this through standard redux selectors.
 */
const useSocketGroup = (group: string) => {
  const dispatch = useAppDispatch();
  const websocketsStatus = useAppSelector((state) => state.websockets.status);
  const groupStatus =
    useAppSelector(
      (state) => state.websockets.groups.find((g) => g.group === group)?.status,
    ) ?? STATUS_ERROR;

  const status = {
    connected: websocketsStatus.connected && groupStatus.connected,
    pending: groupStatus.pending,
    error: websocketsStatus.error || groupStatus.error,
  };

  // Join whenever the socket is connected.
  useEffect(() => {
    if (websocketsStatus.connected && !websocketsStatus.error) {
      dispatch({ type: WebsocketsAT.GROUP_JOIN.BEGIN, payload: { group } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, websocketsStatus.connected, websocketsStatus.error]);

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

export type Websockets = {
  status: WebsocketsStatus;
  groups: WebsocketsGroup[];
};

export type WebsocketsStatus = {
  connected: boolean;
  error: boolean;
};

export type WebsocketsGroup = {
  group: string;
  status: WebsocketsGroupStatus;
};

export type WebsocketsGroupStatus = {
  connected: boolean;
  pending: boolean;
  error: boolean;
};

export type UnknownWebsocket = {
  connected?: boolean;
};

export const WS_INIT = 'wsOrder/init';
export const WS_INIT_CUSTOM = 'wsOrder/wsCustomInit';
export const WS_CLOSE = 'wsOrder/close';

export const WS_CONNECTION_SUCCESS = 'wsOrder/onOpen';
export const WS_CONNECTION_ERROR = 'wsOrder/onError';
export const WS_CONNECTION_CLOSED = 'wsOrder/onClose';

export const WS_ON_MESSAGE = 'wsOrder/onMessage';
export const WS_SEND_MESSAGE = 'wsOrder/sendMessage';

export type IWSActionBase = {
  readonly type: string;
};

export type IWSConnectionInitAction = {} & IWSActionBase;

export type IWSConnectionInitCustomAction = {
  readonly payload: string;
} & IWSActionBase;

export type IWSConnectionCloseAction = {} & IWSActionBase;

export type IWSConnectionSuccessAction = {} & IWSActionBase;

export type IWSConnectionErrorAction = {
  readonly payload: Event;
} & IWSActionBase;

export type IWSConnectionClosedAction = {} & IWSActionBase;

export type IWSGetMessageAction = {
  readonly payload: any;
} & IWSActionBase;

export type IWSSendMessageAction = {
  readonly type: typeof WS_SEND_MESSAGE;

  readonly payload: { message: string };
};

export type TWSAction =
  | IWSConnectionInitAction
  | IWSConnectionInitCustomAction
  | IWSConnectionErrorAction
  | IWSGetMessageAction
  | IWSSendMessageAction;

export type TWSStoreActions = {
  wsInit: string;
  wsCustomInit: string;
  wsSendMessage: string;
  wsClose: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const wsStoreActions: TWSStoreActions = {
  wsInit: WS_INIT,
  wsCustomInit: WS_INIT_CUSTOM,
  wsSendMessage: WS_SEND_MESSAGE,
  wsClose: WS_CLOSE,
  onOpen: WS_CONNECTION_SUCCESS,
  onClose: WS_CONNECTION_CLOSED,
  onError: WS_CONNECTION_ERROR,
  onMessage: WS_ON_MESSAGE,
};

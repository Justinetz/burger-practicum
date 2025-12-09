import type { AppDispatch, RootState } from '../services/store';
import type {
  TWSStoreActions,
  TWSAction,
  IWSConnectionInitCustomAction,
  IWSSendMessageAction,
} from '../utils/socket-types';
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux';

export const socketMiddleware = (wsUrl: string, wsActions: TWSStoreActions): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    const dispatch = store.dispatch.bind(store);
    const getState = store.getState.bind(store);

    let socket: WebSocket | null = null;

    return (next: Dispatch<TWSAction>) => (action: TWSAction) => {
      const { accessToken } = getState().user;

      const { wsInit, wsCustomInit, wsSendMessage, wsClose, onOpen, onClose, onError, onMessage } = wsActions;
      const type = action.type;

      if (type === wsInit) {
        socket = new WebSocket(wsUrl);
      }
      if (type === wsCustomInit) {
        const payload = (action as IWSConnectionInitCustomAction).payload;
        socket = new WebSocket(payload);
      }

      if (socket) {
        socket.onopen = () => {
          dispatch({ type: onOpen });
        };

        socket.onerror = () => {
          dispatch({ type: onError });
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const { success: _, ...restData } = data;

          dispatch({ type: onMessage, payload: restData });
        };

        socket.onclose = () => {
          dispatch({ type: onClose });
        };

        if (type === wsSendMessage) {
          const payload = (action as IWSSendMessageAction).payload;
          const message = { ...payload, token: accessToken };
          socket.send(JSON.stringify(message));
        }
        if (type === wsClose) {
          socket.close();
        }
      }

      next(action);
    };
  }) as Middleware;
};

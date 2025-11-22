import { apiUrl, jwtExpiredErrorText } from '../utils/constants';

import type { TIngredient } from '../utils/ingredient-types';
import type { TLoginUser, TRegisterUser, TUser } from '../utils/user-types';

// #region Response Data

type TResponse = { success: boolean };

export type TIngredientsResponseData = { data: TIngredient[] } & TResponse;

export type TSendOrderResponseData = {
  name: string;
  order: {
    number: number;
  };
} & TResponse;

export type TUserResponseData = {
  user: TUser;
} & TResponse;

export type TRefreshTokenResponseData = {
  accessToken: string;
  refreshToken: string;
} & TResponse;

export type TAuthResponseData = {
  user: TUser;
} & TRefreshTokenResponseData &
  TResponse;

//#endregion

const postRequestData = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const buildError = (operationName: string, reason: any): Error =>
  new Error(`Операция "${operationName}" завершилась ошибкой: ${reason}`);

const proceedHttpResponse = async <T>(httpResp: Response, operationName: string): Promise<T> => {
  if (httpResp.ok) {
    return httpResp.json() as Promise<T>;
  } else {
    const data = await httpResp.json();
    if (data.message === jwtExpiredErrorText) {
      return Promise.reject(buildError(operationName, jwtExpiredErrorText));
    }

    return Promise.reject(buildError(operationName, httpResp.statusText ?? httpResp.status));
  }
};

const callRemoteApi = async <T>(operationName: string, api: string, apiData?: RequestInit): Promise<T> => {
  try {
    const httpResp = await fetch(`${apiUrl}${api}`, apiData);
    return await proceedHttpResponse<T>(httpResp, operationName);
  } catch (e) {
    return await Promise.reject(buildError(operationName, e));
  }
};

/** Загрузить все возможные ингредиенты */
export const loadIngredients = (): Promise<TIngredientsResponseData> => {
  return callRemoteApi<TIngredientsResponseData>('загрузка ингредиентов', 'ingredients');
};

/** Отправить заказ на сборку */
export const sendOrder = (ingredientIds: string[]): Promise<TSendOrderResponseData> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ ingredients: ingredientIds }),
  };

  return callRemoteApi<TSendOrderResponseData>('отправка заказа', 'orders', requestData);
};

/** Регистрация нового пользователя */
export const register = (data: TRegisterUser): Promise<TAuthResponseData> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi<TAuthResponseData>('регистрация', 'auth/register', requestData);
};

/** Логин зарегистированного пользователя */
export const login = (data: TLoginUser): Promise<TAuthResponseData> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi<TAuthResponseData>('АУФ', 'auth/login', requestData);
};

/** Получение информации о себе авторизованного пользователя */
export const getUser = (accessToken: string): Promise<TUserResponseData> => {
  const requestData = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return callRemoteApi<TUserResponseData>('получение информации о пользователе', 'auth/user', requestData);
};

/** Обновление информации о себе авторизованного пользователя */
export const patchUser = (accessToken: string, data: TUser): Promise<TUserResponseData> => {
  const requestData = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  };

  return callRemoteApi<TUserResponseData>('обновление информации о пользователе', 'auth/user', requestData);
};

/** Обновление токена авторизованного пользователя */
export const refreshToken = (refreshToken: string): Promise<TRefreshTokenResponseData> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ token: refreshToken }),
  };

  return callRemoteApi<TRefreshTokenResponseData>('обновление токена', 'auth/token', requestData);
};

/** Выход авторизованного пользователя */
export const logout = (refreshToken: string): Promise<any> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ token: refreshToken }),
  };

  return callRemoteApi('выход', 'auth/logout', requestData);
};

/** Восстановление забытого пароля */
export const forgotPassword = (email: string): Promise<any> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ email }),
  };

  return callRemoteApi('восстановление пароля', 'password-reset', requestData);
};

/** Сброс пароля */
export const resetPassword = (data: { password: string; token: string }): Promise<any> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi('сброс пароля', 'password-reset/reset', requestData);
};

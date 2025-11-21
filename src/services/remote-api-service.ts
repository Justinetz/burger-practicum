import { apiUrl } from '../utils/constants';

import type { TLoginUser, TRegisterUser, TUser } from '../utils/user-types';

export const jwtExpiredErrorText = 'jwt expired';

const postRequestData = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const buildError = (operationName: string, reason: any): Error =>
  new Error(`Операция "${operationName}" завершилась ошибкой: ${reason}`);

const proceedHttpResponse = async (httpResp: Response, operationName: string): Promise<any> => {
  if (httpResp.ok) {
    return httpResp.json();
  } else {
    const data = await httpResp.json();
    if (data.message === jwtExpiredErrorText) {
      return Promise.reject(buildError(operationName, jwtExpiredErrorText));
    }

    return Promise.reject(buildError(operationName, httpResp.statusText ?? httpResp.status));
  }
};

const callRemoteApi = async (operationName: string, api: string, apiData?: RequestInit): Promise<any> => {
  try {
    const httpResp = await fetch(`${apiUrl}${api}`, apiData);
    return await proceedHttpResponse(httpResp, operationName);
  } catch (e) {
    return await Promise.reject(buildError(operationName, e));
  }
};

/** Загрузить все возможные ингредиенты */
export const loadIngredients = (): Promise<any> => {
  return callRemoteApi('загрузка ингредиентов', 'ingredients');
};

/** Отправить заказ на сборку */
export const sendOrder = (ingredientIds: string[]): Promise<any> => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ ingredients: ingredientIds }),
  };

  return callRemoteApi('отправка заказа', 'orders', requestData);
};

/** Регистрация нового пользователя */
export const register = (data: TRegisterUser) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi('регистрация', 'auth/register', requestData);
};

/** Логин зарегистированного пользователя */
export const login = (data: TLoginUser) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi('АУФ', 'auth/login', requestData);
};

/** Получение информации о себе авторизованного пользователя */
export const getUser = (accessToken: string) => {
  const requestData = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return callRemoteApi('получение информации о пользователе', 'auth/user', requestData);
};

/** Обновление информации о себе авторизованного пользователя */
export const patchUser = (accessToken: string, data: TUser) => {
  const requestData = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  };

  return callRemoteApi('обновление информации о пользователе', 'auth/user', requestData);
};

/** Обновление токена авторизованного пользователя */
export const refreshToken = (refreshToken: string) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ token: refreshToken }),
  };

  return callRemoteApi('обновление токена', 'auth/token', requestData);
};

/** Выход авторизованного пользователя */
export const logout = (refreshToken: string) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ token: refreshToken }),
  };

  return callRemoteApi('выход', 'auth/logout', requestData);
};

/** Восстановление забытого пароля */
export const forgotPassword = (email: string) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify({ email }),
  };

  return callRemoteApi('восстановление пароля', 'password-reset', requestData);
};

/** Сброс пароля */
export const resetPassword = (data: { password: string; token: string }) => {
  const requestData = {
    ...postRequestData,
    body: JSON.stringify(data),
  };

  return callRemoteApi('сброс пароля', 'password-reset/reset', requestData);
};

import { apiUrl } from '../utils/constants';

const buildError = (operationName: string, reason: any): Error =>
  new Error(`Операция "${operationName}" завершилась ошибкой: ${reason}`);

const proceedHttpResponse = (
  httpResp: Response,
  operationName: string
): Promise<any> => {
  if (httpResp.ok) {
    return httpResp.json();
  } else {
    return Promise.reject(
      buildError(operationName, httpResp.statusText ?? httpResp.status)
    );
  }
};

const callRemoteApi = async (
  operationName: string,
  api: string,
  apiData?: RequestInit
): Promise<any> => {
  try {
    const httpResp = await fetch(`${apiUrl}${api}`, apiData);
    return await proceedHttpResponse(httpResp, operationName);
  } catch (e) {
    return await Promise.reject(buildError(operationName, e));
  }
};

export const loadIngredients = (): Promise<any> => {
  return callRemoteApi('загрузка ингредиентов', 'ingredients');
};

export const sendOrder = (ingredientIds: string[]): Promise<any> => {
  const requestData = {
    body: JSON.stringify({ ingredients: ingredientIds }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return callRemoteApi('отправка заказа', 'orders', requestData);
};

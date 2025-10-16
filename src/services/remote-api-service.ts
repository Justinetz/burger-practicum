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

export const loadIngredients = (): Promise<any> => {
  return fetch(`${apiUrl}ingredients`)
    .then((httpResp: Response) => proceedHttpResponse(httpResp, 'загрузка ингредиентов'))
    .catch((e: any) => Promise.reject(buildError('загрузка ингредиентов', e)));
};

export const sendOrder = (ingredientIds: string[]): Promise<any> => {
  const requestData = {
    body: JSON.stringify({ ingredients: ingredientIds }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(`${apiUrl}orders`, requestData)
    .then((httpResp: Response) => proceedHttpResponse(httpResp, 'отправка заказа'))
    .catch((e: any) => Promise.reject(buildError('отправка заказа', e)));
};

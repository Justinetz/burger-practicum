import { apiUrl } from '../utils/constants';

import type { TIngredient } from '../utils/types';

type TResponse<T> = {
  success: boolean;
  data: T[];
};

export class DataLoader {
  public loadIngredients(callback: (data: TIngredient[]) => void): void {
    fetch(`${apiUrl}ingredients`)
      .then((httpResp: Response) => {
        if (httpResp.ok) {
          httpResp
            .json()
            .then((response: TResponse<TIngredient>) => {
              if (response && response.success && response.data) {
                callback(response.data);
              } else {
                callback([]);
              }
            })
            .catch((e) => console.log(e));
        } else {
          console.log(
            `Загрузка ингредиентов завершилась ошибкой: ${httpResp.statusText}`
          );
          callback([]);
        }
      })
      .catch((e) => console.log(e));
  }
}

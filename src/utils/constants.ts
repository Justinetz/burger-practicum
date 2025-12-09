//#region Remote API

export const apiUrl = 'https://norma.education-services.ru/api/';

export const wsUrl = 'wss://norma.education-services.ru/';
export const wsOrdersApi = 'orders/all';

export const jwtExpiredErrorText = 'jwt expired';

//#endregion

//#region Internal Behaviour

/** Роуты приложения */
export const appRoutes = {
  /** Главная страница, конструктор бургеров */
  main: '/',

  /** Страница авторизации */
  login: '/login',
  /** Страница авторизации */
  register: '/register',
  /** Страница восстановления пароля */
  forgotPassword: '/forgot-password',
  /** Страница сброса пароля */
  resetPassword: '/reset-password',

  /** Страница ингредиента */
  ingredientDetails: '/ingredients/:id',

  /** Страница с настройками профиля пользователя */
  profile: '/profile',
  /** Страница ленты заказов пользователя */
  profileOrders: '/profile/orders',
  /** Страница заказа в истории заказов пользователя */
  profileOrderDetails: '/profile/orders/:number',

  /** Лента заказов */
  feed: '/feed',
  /** Страница заказа в ленте */
  feedDetails: '/feed/:number',

  builder: {
    ingredientDetails: (id: string) => `/ingredients/${id}`,
  },
};

export const ingredientDragDropKey = 'ingredient-dnd-key';
export const constructorDragDropKey = 'constructor-item-dnd-key';

//#endregion

//#region Data

export const bunCount = 2;

//#endregion

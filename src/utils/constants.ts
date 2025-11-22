//#region Remote API

export const apiUrl = 'https://norma.education-services.ru/api/';

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
  /** Страница с настройками профиля пользователя */
  profile: '/profile',
  /** Страница ингредиента */
  ingredientDetails: '/ingredients/:id',
  /** Страница ленты заказов пользователя */
  profileOrders: '/profile/orders',
  feed: '/feed',

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

import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { useAppSelector } from '../../hooks/use-selector';
import {
  HomePage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  RegisterPage,
  ProfilePage,
  ProfileOrdersPage,
  IngredientPage,
  NotFoundPage,
} from '../../pages';
import { loadAllIngredients } from '../../services/ingredient/ingredients-reducer';
import { getUser, refreshToken } from '../../services/user/user-reducer';
import {
  isAuthenticated as checkUserAuthenticated,
  canResetPassword as checkUserCanResetPassword,
  isAuthInitialized,
} from '../../services/user/user-selector';
import { appRoutes } from '../../utils/constants';
import { Modal } from '../modal/modal';
import { ProtectedRouteElement } from '../protected-route/protected-route';

import styles from './app.module.css';

type AppLocationState = { background?: Location } | null;

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  const state = (location.state as AppLocationState) ?? null;
  const background = state?.background;

  const isAuthReady = useAppSelector(isAuthInitialized);
  const isAuthenticated = useAppSelector(checkUserAuthenticated);
  const canResetPassword = useAppSelector(checkUserCanResetPassword);

  const closeModal = () => navigate(-1);

  useEffect(() => {
    const startWithAuth = async () => {
      const userRefreshToken = await dispatch(refreshToken());

      if (refreshToken.fulfilled.match(userRefreshToken)) {
        dispatch(getUser());
      }
    };

    dispatch(loadAllIngredients());

    startWithAuth().catch((e: any) => console.error(e));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path={appRoutes.main} element={<HomePage />} />
        <Route
          element={
            <ProtectedRouteElement
              isAllowed={!isAuthenticated}
              isReady={isAuthReady}
              redirectPath={appRoutes.main}
              fallback={null}
            />
          }
        >
          <Route path={appRoutes.login} element={<LoginPage />} />
          <Route path={appRoutes.register} element={<RegisterPage />} />
          <Route path={appRoutes.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRouteElement
              isAllowed={canResetPassword}
              isReady={isAuthReady}
              redirectPath={appRoutes.main}
              fallback={null}
            />
          }
        >
          <Route path={appRoutes.resetPassword} element={<ResetPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRouteElement
              isAllowed={isAuthenticated}
              isReady={isAuthReady}
              redirectPath={appRoutes.login}
              fallback={null}
            />
          }
        >
          <Route path={appRoutes.profile} element={<ProfilePage />} />
          <Route path={appRoutes.profileOrders} element={<ProfileOrdersPage />} />
        </Route>

        <Route path={appRoutes.ingredientDetails} element={<IngredientPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path={appRoutes.ingredientDetails}
            element={
              <Modal open onClose={closeModal}>
                <IngredientPage />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

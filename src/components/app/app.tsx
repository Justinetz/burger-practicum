import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { loadAllIngredients } from '../../services/ingredient/ingredients-reducer';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAllIngredients()).catch((e: any) => console.error(e));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;

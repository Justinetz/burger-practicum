import type React from 'react';

import styles from './page-form.module.css';

type IPageFormProps = {
  children: React.ReactNode;
  onSubmit?: (evt: React.SyntheticEvent) => void;
};

export const PageForm = ({ children, onSubmit }: IPageFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

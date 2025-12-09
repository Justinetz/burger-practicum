import type React from 'react';

import styles from './page-form.module.css';

type TPageFormProps = {
  children: React.ReactNode;
  onSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
};

export const PageForm = ({ children, onSubmit }: TPageFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

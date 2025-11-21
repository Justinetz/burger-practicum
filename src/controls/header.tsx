import type React from 'react';

import styles from './controls.module.css';

type IHeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: IHeaderProps) => {
  return <p className={`${styles.header} text text_type_main-medium mb-5`}>{children}</p>;
};

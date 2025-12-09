import type React from 'react';

import styles from './controls.module.css';

type THeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: THeaderProps) => {
  return <p className={`${styles.header} text text_type_main-medium mb-5`}>{children}</p>;
};

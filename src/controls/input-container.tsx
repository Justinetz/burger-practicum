import type React from 'react';

import styles from './controls.module.css';

type IInputContainerProps = {
  children: React.ReactNode;
};

export const InputContainer = (props: IInputContainerProps) => {
  return <div className={`${styles.inputContainer} mb-6`}>{props.children}</div>;
};

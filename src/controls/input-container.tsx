import type React from 'react';

import styles from './controls.module.css';

type TInputContainerProps = {
  children: React.ReactNode;
};

export const InputContainer = (props: TInputContainerProps) => {
  return <div className={`${styles.inputContainer} mb-6`}>{props.children}</div>;
};

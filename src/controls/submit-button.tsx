import { Button } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './controls.module.css';

type ISubmitButtonProps = {
  children: React.ReactNode;
};

export const SubmitButton = ({ children }: ISubmitButtonProps) => {
  return (
    <div className={`${styles.buttonWrapper} mb-20`}>
      <Button type="primary" size="medium" htmlType={'submit'}>
        {children}
      </Button>
    </div>
  );
};

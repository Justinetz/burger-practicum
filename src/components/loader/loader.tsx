import type { FC } from 'react';

import styles from './loader.module.css';

type TLoaderProps = {
  text?: string;
  overlay: boolean;
};

export const Loader: FC<TLoaderProps> = (props: TLoaderProps) => {
  const { overlay, text } = props;
  return (
    <div className={overlay ? styles.overlay : ''}>
      <div className={styles.loader}>
        <div className={styles.spinner} />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
};

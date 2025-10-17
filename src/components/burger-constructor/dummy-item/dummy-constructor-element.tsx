import type { JSX } from 'react';

import styles from './dummy-constructor-element.module.css';

export const DummyConstructorElement = (props: {
  text: string;
  type: 'top' | 'bottom' | 'middle';
}): JSX.Element => {
  const { text, type } = props;

  const className =
    type === 'top'
      ? styles.top_root
      : type === 'bottom'
        ? styles.bottom_root
        : styles.middle_root;

  return (
    <div className={`${styles.dummy_root} ${className}`}>
      <span>{text}</span>
    </div>
  );
};

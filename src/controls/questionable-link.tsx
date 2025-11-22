import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './controls.module.css';

type IQuestionableLinkProps = {
  children: string;
  redirectLink: string;
  title: string;
};

export const QuestionableLink: React.FC<IQuestionableLinkProps> = (props) => {
  return (
    <p className={`mb-4 ${styles.questionableText} text text_type_main-default"`}>
      {props.children}{' '}
      <Link to={props.redirectLink} className={`${styles.questionableLink} text text_type_main-default`}>
        {props.title}
      </Link>
    </p>
  );
};

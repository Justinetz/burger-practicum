import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import React from 'react';

import { Header, QuestionableLink, InputContainer, SubmitButton } from '../../controls';
import { PageForm } from '../../forms/page-form';
import { appRoutes } from '../../utils/constants';

export const ResetPasswordPage: React.FC = () => {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <PageForm>
        <Header>Восстановление пароля</Header>
        <InputContainer>
          <PasswordInput name="password" value={value} onChange={(e) => setValue(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <Input
            name="code"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Введите код из письма"
            error={false}
            errorText="Ошибка"
            onPointerEnter={undefined}
            onPointerLeave={undefined}
          />
        </InputContainer>
        <SubmitButton>Сохранить</SubmitButton>
        <QuestionableLink redirectLink={appRoutes.login} title="Войти">
          Вспомнили пароль?
        </QuestionableLink>
      </PageForm>
    </div>
  );
};

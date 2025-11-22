import { Input } from '@krgaa/react-developer-burger-ui-components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Header, QuestionableLink, InputContainer, SubmitButton } from '../../controls';
import { PageForm } from '../../forms/page-form';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { forgotPassword, allowPasswordReset } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

export const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const resultAction = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(resultAction)) {
      dispatch(allowPasswordReset());
      navigate('/reset-password', { replace: true });
    }
  };

  return (
    <div>
      <PageForm onSubmit={handleSubmit}>
        <Header>Восстановление пароля</Header>
        <InputContainer>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Укажите e-mail"
            error={false}
            errorText="Ошибка"
            onPointerEnter={undefined}
            onPointerLeave={undefined}
          />
        </InputContainer>
        <SubmitButton>Восстановить</SubmitButton>
        <QuestionableLink redirectLink={appRoutes.login} title="Войти">
          Вспомнили пароль?
        </QuestionableLink>
      </PageForm>
    </div>
  );
};

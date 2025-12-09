import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { Header, QuestionableLink, InputContainer, SubmitButton } from '../../controls';
import { PageForm } from '../../forms/page-form';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { useForm } from '../../hooks/use-form';
import { login } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

import type { TModel } from '../../utils';
import type { TLoginUser } from '../../utils/user-types';
import type React from 'react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { values, handleChange } = useForm({} as TModel);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { email, password } = values;
    const res = await dispatch(login({ email, password } as TLoginUser));

    if (login.fulfilled.match(res)) {
      navigate(from, { replace: true });
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Надо запомнить, куда возвращаться
  const from = location.state?.from?.pathname ?? appRoutes.main;

  return (
    <div>
      <PageForm onSubmit={handleSubmit}>
        <Header>Вход</Header>
        <InputContainer>
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            type="text"
            placeholder="E-mail"
            error={false}
            errorText="Ошибка"
            onPointerEnter={undefined}
            onPointerLeave={undefined}
          />
        </InputContainer>
        <InputContainer>
          <PasswordInput name="password" value={values.password} onChange={handleChange} />
        </InputContainer>
        <SubmitButton>Войти</SubmitButton>
        <QuestionableLink redirectLink={appRoutes.register} title="Зарегистрироваться">
          Вы новый пользователь?
        </QuestionableLink>
        <QuestionableLink redirectLink={appRoutes.forgotPassword} title="Восстановить пароль">
          Забыли пароль?
        </QuestionableLink>
      </PageForm>
    </div>
  );
};

import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { Header, QuestionableLink, InputContainer, SubmitButton } from '../../controls';
import { PageForm } from '../../forms/page-form';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { useForm } from '../../hooks/use-form';
import { register } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

import type { TModel } from '../../utils';
import type { TRegisterUser } from '../../utils/user-types';
import type React from 'react';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { values, handleChange } = useForm({} as TModel);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { name, email, password } = values;
    const resultAction = await dispatch(register({ name, email, password } as TRegisterUser));
    if (register.fulfilled.match(resultAction)) {
      navigate(appRoutes.main, { replace: true });
    }
  };

  return (
    <div>
      <PageForm onSubmit={handleSubmit}>
        <Header>Регистрация</Header>

        <InputContainer>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            type="text"
            placeholder="Имя"
            error={false}
            errorText="Ошибка"
            onPointerEnter={undefined}
            onPointerLeave={undefined}
          />
        </InputContainer>

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

        <SubmitButton>Зарегистрироваться</SubmitButton>

        <QuestionableLink redirectLink={appRoutes.login} title="Войти">
          Уже зарегистрированы?
        </QuestionableLink>
      </PageForm>
    </div>
  );
};

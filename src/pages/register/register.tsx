import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Header, QuestionableLink, InputContainer, SubmitButton } from '../../controls';
import { PageForm } from '../../forms/page-form';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { register } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    const data = { name, email, password };
    const resultAction = await dispatch(register(data));
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="E-mail"
            error={false}
            errorText="Ошибка"
            onPointerEnter={undefined}
            onPointerLeave={undefined}
          />
        </InputContainer>

        <InputContainer>
          <PasswordInput name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </InputContainer>

        <SubmitButton>Зарегистрироваться</SubmitButton>

        <QuestionableLink redirectLink={appRoutes.login} title="Войти">
          Уже зарегистрированы?
        </QuestionableLink>
      </PageForm>
    </div>
  );
};

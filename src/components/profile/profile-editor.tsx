import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { InputContainer } from '../../controls';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { useAppSelector } from '../../hooks/use-selector';
import { patchUser } from '../../services/user/user-reducer';
import { getSelf } from '../../services/user/user-selector';

import type { JSX } from 'react';

import styles from './profile-editor.module.css';

export const ProfileEditor = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getSelf);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const shouldShowButtons = useMemo(() => name !== user.name || email !== user.email, [user, name, email]);

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    dispatch(patchUser({ name, email }));
  };

  const handleReset = () => {
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <InputContainer>
        <Input
          name="name"
          type="text"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          icon="EditIcon"
          placeholder="Имя"
          onPointerEnter={undefined}
          onPointerLeave={undefined}
        />
      </InputContainer>

      <InputContainer>
        <Input
          name="login"
          type="text"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          icon="EditIcon"
          placeholder="Логин"
          onPointerEnter={undefined}
          onPointerLeave={undefined}
        />
      </InputContainer>

      <InputContainer>
        <Input
          name="password"
          type="password"
          value="password"
          onChange={() => {}}
          icon="EditIcon"
          placeholder="Пароль"
          disabled
          onPointerEnter={undefined}
          onPointerLeave={undefined}
        />
      </InputContainer>

      {shouldShowButtons && (
        <div className={styles.button_panel}>
          <Button type="secondary" size="medium" onClick={handleReset} htmlType={'button'}>
            Отмена
          </Button>
          <Button htmlType={'button'}>Сохранить</Button>
        </div>
      )}
    </form>
  );
};

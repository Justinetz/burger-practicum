import { useState } from 'react';

import type { ChangeEvent } from 'react';

export type IModel = Record<string, string>;

export function useForm(inputValues: IModel) {
  const [values, setValues] = useState<IModel>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };
  return { values, handleChange, setValues };
}

import { useState } from 'react';

import type { TModel } from '../utils';
import type { ChangeEvent } from 'react';

export function useForm(inputValues: TModel) {
  const [values, setValues] = useState<TModel>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };
  return { values, handleChange, setValues };
}

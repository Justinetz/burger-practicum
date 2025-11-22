export type TBaseUser = {
  email: string;
};

export type TUser = {
  name: string;
} & TBaseUser;

export type TRegisterUser = {
  password: string;
} & TUser;

export type TLoginUser = {
  password: string;
} & TBaseUser;

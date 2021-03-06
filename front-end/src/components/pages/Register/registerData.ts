import * as Yup from 'yup';

export type Values = {
  [key: string]: string;
};

export const registerDefaultData = {
  email: '',
  password: ''
};

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string().required('Вкажіть вашу пошту'),
  password: Yup.string().required('Вкажіть ваш пароль')
});

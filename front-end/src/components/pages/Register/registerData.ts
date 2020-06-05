import * as Yup from 'yup';

export type Values = {
  [key: string]: string;
};

export const registerDefaultData = {
  email: 'v3il@ukr.net',
  password: '12345678'
};

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неправильний формат')
    .required('Вкажіть вашу пошту'),
  password: Yup.string().required('Вкажіть ваш пароль')
});

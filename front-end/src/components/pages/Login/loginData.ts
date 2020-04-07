import * as Yup from 'yup';

export type Values = {
  [key: string]: string;
};

export const loginDefaultData = {
  email: 'user@test.com',
  password: '12345678'
};

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong format')
    .required('Email is required'),
  password: Yup.string().required('Password is required')
});

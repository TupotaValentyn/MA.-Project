import * as Yup from 'yup';

export const generateScheme = (fields: any) => {
  return fields.reduce((prev: any, current: any) => {
    return {
      ...prev,
      [current]: Yup.string().required()
    };
  }, {});
};

export const createSchema = (fields: any) => {
  return Yup.object().shape(generateScheme(fields));
};

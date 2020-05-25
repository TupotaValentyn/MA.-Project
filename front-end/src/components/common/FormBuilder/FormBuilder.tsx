import React, { FC, useCallback } from 'react';
// import {
//   RegistrationDatePickerField,
//   RegistrationFieldType,
//   RegistrationOption
// } from '@organisms/RegistrationForm/registrationTypes';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
// import DatePicker from '@components/molecules/DatePicker';
// import { MIN_DATE } from '@organisms/RegistrationForm/registrationData';
import { useFormik } from 'formik';
import { Namespace, useTranslation } from 'react-i18next';
// import {
//   DefaultValuesType,
//   ExtendFieldTypes,
//   FieldsTypeString,
//   FormBuilderSelectLanguages,
//   FormField
// } from '@components/common/formBuilderTypes';
import { ObjectSchema, Shape } from 'yup';

type Props = {
  fields: any[];
  onSubmit: (form: any) => void;
  initialValues: any;
  validationSchema: ObjectSchema<Shape<object, any>>;
  namespace?: Namespace;
  builderStyles: string[];
  formActions?: any;
};

const FormBuilder: FC<Props> = ({
  fields,
  onSubmit,
  initialValues,
  validationSchema,
  namespace,
  builderStyles,
  formActions
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation(namespace);

  const [formStyles, fieldsStyles, submitButtonStyles] = builderStyles;

  const {
    // values: { agreement },
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useFormik({
    onSubmit,
    initialValues,
    validationSchema
  });
  const handleDate = (field: any) => (event: any) => {
    setFieldValue(field, event);
  };

  /**
   * Functional for external submittable control
   * @param touched
   * @param errors
   */

  // useEffect(() => {
  //   if (!Object.keys(errors).length) {
  //     setIsValid(() => true);
  //     setSubmittable(() => true);
  //   }
  // }, [errors, touched]);
  //
  // useEffect(() => {
  //   setIsTouched(() => !Object.keys(touched).length as boolean);
  // }, [errors, touched]);

  const handleError = useCallback(
    (field: any): boolean => {
      return (errors[field] && touched[field]) as boolean;
    },
    [errors, touched]
  );

  const errorTranslation = useCallback(
    (field: any): string => {
      return handleError(field) ? t(errors[field] as string) : '';
    },
    [errors, touched]
  );

  const labelTranslation = useCallback(
    (fieldName: any): string => {
      return t(`${fieldName}.title`);
    },
    [language]
  );

  const textFieldProps = (name: string, type: string, className: string) => {
    return {
      key: name,
      className: `${className}`,
      name,
      label: labelTranslation(name),
      type,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      error: handleError(name),
      helperText: errorTranslation(name)
    };
  };

  const textField = (fieldName: any) => {
    return <TextField {...textFieldProps(fieldName, 'text', fieldsStyles)} />;
  };

  const selectField = (select: any | undefined) => {
    console.log('[HERE]', select);
    if (select) {
      const { name, label, options } = select;
      return (
        <FormControl key={name} className={`${fieldsStyles}`}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            name={name}
          >
            {options.map((option: any) => {
              const { value, content } = option;
              return (
                <MenuItem key={value} value={value}>
                  {content}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }

    return null;
  };

  // const datePicker = (datePickerName: any) => {
  //   return (
  //     <DatePicker
  //       key={datePickerName}
  //       className={`${fieldsStyles}`}
  //       name="birthday"
  //       label="Date of birthday"
  //       currentDate={values.birthday}
  //       onChange={handleDate(datePickerName)}
  //       variant="inline"
  //       maxDate={Date.now()}
  //       maxDateMessage={errors.birthday}
  //     />
  //   );
  // };

  const checkbox = (checkboxName: string) => {
    return (
      <FormControl key={checkboxName} className={`${fieldsStyles}`}>
        <FormControlLabel
          control={
            <Checkbox
              checked={false}
              color="primary"
              name="agreement"
              onChange={handleChange}
            />
          }
          label={t('common:helpDialog.agreeToProcessPersonalData')}
        />
      </FormControl>
    );
  };

  const passwordTextField = (fieldName: any, classes: string) => {
    return (
      <TextField
        {...textFieldProps(fieldName, 'password', `${fieldsStyles} ${classes}`)}
      />
    );
  };

  const renderFormActions = () => {
    const defaultButton = (
      <Button
        variant="contained"
        type="submit"
        color="primary"
        className={submitButtonStyles}
      >
        {t('submit')}
      </Button>
    );
    return formActions ? formActions(submitButtonStyles) : defaultButton;
  };

  const fieldsFactory = (field: any) => {
    const { name, type, select, classes } = field;
    switch (type) {
      case 'text':
        return textField(name);
      case 'password':
        return passwordTextField(name, classes);
      case 'select':
        return selectField(field);
      // case 'date':
      //   return datePicker(name);
      case 'checkbox':
        return checkbox(name);
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles}>
      {fields.map(fieldsFactory)}
      {renderFormActions()}
    </form>
  );
};

export default FormBuilder;

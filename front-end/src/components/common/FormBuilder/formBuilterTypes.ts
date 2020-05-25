export type RegistrationFieldType =
  | 'language'
  | 'title'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'birthday'
  | 'agreement'
  | string;

export type FormField = {
  readonly [F in RegistrationFieldType]: string | boolean;
};

export interface RegistrationOption {
  readonly value: string;
  readonly content: string;
}

export type Languages = 'en' | 'de' | string;

export type RegistrationSelectLanguage = {
  readonly [F in Languages]: RegistrationSelect;
};

export interface RegistrationSelect {
  readonly name: RegistrationFieldType;
  readonly label: string;
  readonly options: RegistrationOption[];
}

export interface RegistrationFormInterface extends FormField {
  readonly language: 'en' | 'de';
  readonly title: 'Mr' | 'Mrs';
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly email: string;
  readonly confirmPassword: string;
  readonly birthday: string;
  readonly agreement: boolean;
}

type FieldType = 'text' | 'select' | 'date' | 'checkbox' | 'password';

export type RegistrationFieldsType = {
  name: RegistrationFieldType;
  type: FieldType;
  select?: RegistrationSelectLanguage | undefined;
};

export type RegistrationDatePickerField = 'birthday' | string;

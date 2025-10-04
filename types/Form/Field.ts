import * as Yup from 'yup';
import type { OptionSelect, OptionRadio } from './Option';
import type * as DateTypes from '~t/DateRange';
import type { Image } from '../Image';
import type { RuleValid } from './RuleValid';

interface PropFuncBtn {
  text?: string;
  icon?: string;
  mode?: string;
  disabled?: boolean;
  action: Function | { [key: string]: Function };
}

interface PropUnit {
  text?: string;
  icon?: string;
  badge?: { [key: string]: Image } | string;
}

export type AbstractField = {
  label: string;
  name: string;
  id?: string;
  viewMode?: 'limited'|'half'|'';
  validation?: Yup.AnySchema;
  disabled?: boolean;
  onTouched?: Function;
  classNames?: string;
  tooltip?: { text?: string };
}

export type InputField = AbstractField & {
  fieldMode: 'input';
  type?: string;
  placeholder?: string;
  behaviourMode?: 'money'|'int';
  counter?: boolean,
  maxlength?: number;
  funcBtn?: PropFuncBtn;
  outerFuncBtn?: PropFuncBtn;
  unit?: PropUnit;
}

export type PasswordField = AbstractField & {
  fieldMode: 'inputPassword';
  autocomplete?: string;
  placeholder?: string;
  maxlength?: number;
}

export type PasswordRulesField = AbstractField & {
  fieldMode: 'inputPasswordRules';
  rules: RuleValid[];
  placeholder?: string;
  maxlength?: number;
}

export type OtpField = AbstractField & {
  fieldMode: 'inputOtp';
  isPrefixLetter?: boolean;
  disabledPrefixLetter?: boolean;
  maxlength?: number;
}

export type TextareaField = AbstractField & {
  fieldMode: 'textarea';
  counter?: boolean;
  placeholder?: string;
  maxlength?: number;
}

export type DateSingleField = AbstractField & {
  fieldMode: 'dateSingle';
  minDate?: DateTypes.DateOpt;
  maxDate?: DateTypes.DateOpt;
}

export type DateMultipleField = AbstractField & {
  fieldMode: 'dateMultiple';
  minDate?: DateTypes.DateOpt;
  maxDate?: DateTypes.DateOpt;
  presetRanges?: DateTypes.RangePreset[]
  presetTitle?: string;
}

export type SelectField = AbstractField & {
  fieldMode: 'select' | 'selectCountry' | 'selectWallet' | 'selectTransferType';
  options: OptionSelect[];
  placeholder?: string;
}

export type RadioField = AbstractField & {
  fieldMode: 'radioBadge' | 'radio';
  options: OptionRadio[];
}

export type SwitchField = AbstractField & {
  fieldMode: 'switch';
}

export type CheckboxField = AbstractField & {
  fieldMode: 'checkbox';
}

export type TelField = AbstractField & {
  fieldMode: 'tel';
  selfAction?: (args: unknown) => void;
}

export type FileAutouploadField = AbstractField & {
  fieldMode: 'fileAutoupload';
  textFormat?: string;
  textDescription?: string,
}

export type CounterpartyField = AbstractField & {
  fieldMode: 'party';
  walletType?: string;
}

export type AnyNotfield = AbstractField & {
  id?: string;
  label: '';
  name: '';
  validation?: undefined;
  fieldMode: 'nfList' | 'nfText' | 'nfSwap' | 'nfBtn' | 'nfMessage';
  items?: any[];
  content?: any;
  mode?: 'error'|'success'|'info';
}

export type Field = InputField
  | PasswordField
  | PasswordRulesField
  | OtpField
  | TextareaField
  | DateSingleField
  | SelectField
  | TelField
  | RadioField
  | SwitchField
  | CheckboxField
  | FileAutouploadField
  | CounterpartyField
  | DateMultipleField
  | AnyNotfield;

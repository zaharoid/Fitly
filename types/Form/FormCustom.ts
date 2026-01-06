import type { FValues } from "./FValues";

export type FormColField = {
  fieldMode: 'input'
    | 'input-number'
    | 'textarea'
    | 'date-picker'
    | 'select'
    | 'checkbox'
    | 'switch'
    | 'radio-group'
    | 'custom-field'
    | 'file-direct'
    | 'decor-title'
    | 'decor-text'
    | 'decor-filelist';
  label: string;
  name: string;
  span?: number;
  pull?: number;
  offset?: number;
  dynamicDisabled?: (fVals: FValues) => boolean,
  counter?: boolean;
  rules?: any[];
  dataType?: 'text' | 'status';
  mode?: 'multiple';
  hidden?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  allowClear?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined,
  placeholder?: string;
  options?: {
    title: string;
    value: string | boolean;
    disabled?: boolean;
  }[];
  checkboxTitle?: string;
  maxlength?: number;
  min?: number;
  max?: number;
  addonAfter?: {
    name: string;
    fallbackVal?: string;
    options: {
      title: string;
      value: string;
      disabled?: boolean;
    }[];
  };
  condition?: (vals: FValues) => boolean;
}

export type FormPanel = {
  id: string;
  title: string;
  exoticMode?: 'default'|'repeated_tab_forms'|'tab_content';
  onSubmit: (vals: any) => void;
  payload?: { [key: string]: any };
  fields: FormColField[];
}

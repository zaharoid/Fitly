export type OptionId = number | string;
interface AbstractOption {
  title: string
  id: OptionId
}

export interface OptionSelect extends AbstractOption {
  $isDisabled?: Boolean,
  [key: string]: any,
}

export interface OptionRadio extends AbstractOption {
  [key: string]: any,
}

export interface OptionCheckbox extends AbstractOption {
  [key: string]: any,
}

export interface DropdownOption extends AbstractOption {
  action: Function | string;
  closeOnClick?: boolean;
  classNames?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface CopiedOption extends AbstractOption {
  copiedContent: string;
}

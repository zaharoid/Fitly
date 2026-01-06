import type { AbstractField } from "~/types/Form/Field";

const commonProps = {
  // dublicate required props in component
  // to have underline of syntax support
  name: {
    type: String,
    required: true,
  },
  // Dublicate id prop in component to avoid IDE issue
  // unknown reason
  id: {
    type: String,
    required: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String as PropType<'limited'|'half'|''>,
    default: '',
  },
  tooltip: {
    type: Object as PropType<AbstractField['tooltip']>,
    default: () => ({}),
  },
  viewMessage: {
    type: String as PropType<'absolute'|'hide'|''>,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
  validateOnChange: {
    type: Boolean,
    default: false,
  },
};

export default commonProps;

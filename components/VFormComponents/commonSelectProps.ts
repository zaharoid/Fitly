import type { OptionSelect } from '~t/Option';

const commonSelectProps = {
  options: {
    type: Array as PropType<OptionSelect[]>,
    default: () => [],
  },
  zeroItemName: {
    type: String,
    default: '',
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  autoReselect: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxLabelLength: {
    type: Number,
    default: -1,
    validator: (val: number) => (val >= -1),
  },
};

export default commonSelectProps;

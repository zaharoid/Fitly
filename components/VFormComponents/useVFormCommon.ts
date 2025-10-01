interface Args {
  props: any,
  emit: Function,
  onOuterChange?: Function,
  valueConverting?: Function,
}

export default (args: Args) => {
  const {
    props,
    emit,
    onOuterChange = () => {},
    valueConverting = (val: any) => val,
  } = args;

  const {
    id, name, modelValue, validateOnChange,
  } = toRefs(props);
  const lastValue = ref();
  const componentId = ref<number>();

  onMounted(() => {
    componentId.value = getCurrentInstance()?.uid || 0;
  });

  const finalId = computed(() => (id.value
    ? id.value
    : `input-${componentId.value}-${name.value}`));

  const {
    value: inputValue,
    errorMessage: inputErrorMessage,
    handleChange,
    handleBlur,
    meta,
  } = useField(name.value || '', undefined, {
    initialValue: modelValue.value,
    syncVModel: false,
  });

  watch(modelValue, (value) => {
    if (value === lastValue.value) return;
    lastValue.value = value;
    onOuterChange(value); // cusom hook
    handleChange(valueConverting(value));
  });

  function toEmit (event: Event, value: any) {
    lastValue.value = value;
    handleChange(event);
    emit('update:modelValue', value);
  }

  function onChange (event: Event) {
    const myTarget = event.target as HTMLInputElement | HTMLTextAreaElement;
    toEmit(event, myTarget.value);
  }

  function toEmitBlur (event: Event, value: any) {
    lastValue.value = value;
    handleBlur(event);
    emit('onBlur', value);
  }

  function onBlur (event ?:any) {
    if (!event) handleBlur();
    if (event instanceof Event) {
      const myTarget = event.target as HTMLInputElement | HTMLTextAreaElement;
      toEmitBlur(event, myTarget.value);
    }
  }

  watch(() => meta.touched, val => emit('touched', val));
  const errorMessage = computed(() => {
    if (validateOnChange.value) return inputErrorMessage.value;
    return meta.touched ? inputErrorMessage.value : undefined;
  });
  const isError = computed(() => Boolean(typeof errorMessage.value === 'string' && !meta.valid));

  return {
    finalId,
    inputValue,
    errorMessage,
    isError,
    toEmit,
    onChange,
    onBlur,
    meta,
  };
};

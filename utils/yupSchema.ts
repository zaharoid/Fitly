import * as Yup from 'yup';
import type { Field } from '~/types/Form/Field';

export function utilGetValidationObj (fields: Field[]) {
  const schema: { [key: string]: Yup.AnySchema } = {};
  fields.forEach(({ name, validation }: Field) => {
    if (!validation) return;
    schema[name] = validation;
  });

  return schema;
}

export function utilGetValidationSchema (fields: Field[]) {
  return Yup.object(utilGetValidationObj(fields));
}

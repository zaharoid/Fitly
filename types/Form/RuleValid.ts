export interface RuleValid {
    id: number | string
    title: string
    validation: (val: string | number) => boolean
  }
  
export const btnTypeOptions = [
    'button', 'submit', 'reset',
  ] as const;
  
  export const viewModeOptions = [
    '',
    'primary', // standart
    'secondary', // standart
    'critical-primary', // critical
    'critical-secondary', // critical
    'ghost-primary', // ghost
    'ghost-critical', // ghost
    'ghost-secondary', // ghost
  ] as const;
  
  export type BtnType = typeof btnTypeOptions[number]; // 'button' | 'submit' | 'reset'
  export type BtnViewMode = typeof viewModeOptions[number]; // 'primary' | 'secondary' | 'critical-primary' | ...
  
  export interface BtnItem {
    id: number | string
    title: string
    action: ((...args: any[]) => void) | string
    viewMode?: BtnViewMode
    icon?: { name: string, sizeClass?: 'string' },
    type?: BtnType;
    form?: string;
    disabled?: boolean,
  }
  
export type DateOpt = Date | null
export interface Range { start: Date, end: Date }
export type RangeOpt = Range | null
export type RangeArr = [Date, Date]
export interface RangePreset { label: string, range: RangeArr }

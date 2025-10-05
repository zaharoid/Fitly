// Function for prettify number
// by default you get number from 12333.126 to '12 333,13'
// but you can change standart behaviour with args:
//
// roundUpTo - how many numbers after point (default 2, not more then 9)
// roundRule - choose from ceil/floor/round. Math func (default 'round')
// coma - view of coma (default ',')

interface PrettyArgs {
    roundUpTo?: number
    minLengthFloat?: number
    roundRule?: 'floor' | 'round' | 'ceil'
    coma?: string
    division?: string
  }
  
  function reduceFault (val: number) {
    const roundFactorFault = 10 ** 5;
    return Math.round(val * roundFactorFault) / roundFactorFault;
  }
  
  // division of number (default '')
  export function utilPrettifyNumber (value: number|string, args: PrettyArgs = {}) {
    if (!value) return '0';
    let myValue = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(myValue)) return '';
  
    const {
      roundUpTo = 2, // not more then 9
      minLengthFloat = 0,
      roundRule = 'ceil',
      coma = '.',
      division = '',
    } = args || {};
  
    const roundFactor = 10 ** Math.min(roundUpTo, 5);
    myValue = Math[roundRule](reduceFault(myValue * roundFactor)) / roundFactor;
  
    const intPart = Math.floor(myValue);
    let floatPart = reduceFault(myValue - intPart);
    floatPart = Math.round(floatPart * roundFactor) / roundFactor;
  
    let intPartStr = String(intPart);
    if (division) {
      intPartStr = intPartStr.split('').reverse().reduce((result, item, index) => {
        const separator = ((index % 3) || !index) ? '' : division;
        return `${item}${separator}${result}`;
      }, '');
    }
  
    let floatPartStr = floatPart ? String(floatPart).replace(/^0\./, '') : '';
  
    if (minLengthFloat) {
      const repeatCount = minLengthFloat - floatPartStr.length;
      floatPartStr = repeatCount > 0 ? `${floatPartStr}${'0'.repeat(repeatCount)}` : floatPartStr;
    }
    floatPartStr = floatPartStr ? `${coma}${String(floatPartStr).replace(/^0\./, '')}` : '';
  
    return `${intPartStr}${floatPartStr}`;
  }
  
  export function utilPrettifyPrice (value: number|string) {
    return utilPrettifyNumber(value, {
      roundUpTo: 2, // not more then 9
      minLengthFloat: 2,
      roundRule: 'ceil',
      coma: '.',
      division: Number(value) > 9999 ? ' ' : '',
    });
  }
  
  export function utilPrettifyRate (value: number|string) {
    return utilPrettifyNumber(value, {
      roundUpTo: 3, // not more then 9
      minLengthFloat: 3,
      roundRule: 'ceil',
      coma: '.',
      division: Number(value) > 9999 ? ' ' : '',
    });
  }
  export function utilNumberFromMask (val: string|number) {
    if (!val && val !== 0) return undefined;
    const clearNumber = Number.parseFloat(String(val).replace(/[^\d.]+/g, ''));
    return Number.isNaN(clearNumber) ? 0 : clearNumber;
  }
  
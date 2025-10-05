export function utilToPascalCase (value: string): string {
    if (!value) return '';
    const strArray = value.toString().split(/\s+|-|_|,/);
    return strArray.reduce((newStr, word) => {
      const capitalizeWord = word.charAt(0).toUpperCase() + word.slice(1);
      return newStr + capitalizeWord;
    }, '');
  }
  
  export function utilToCamelCase (value: string): string {
    if (!value) return '';
    const strArray = value.toString().split(/\s+|-|_|,/);
    return strArray.reduce((newStr, word, index) => {
      const transformFunction = index === 0 ? 'toLowerCase' : 'toUpperCase';
      const capitalizeWord = word.charAt(0)?.[transformFunction]() + word.slice(1);
      return newStr + capitalizeWord;
    }, '');
  }
  
  export function utilToKebabCase (str: string): string {
    if (!str) return '';
    return str
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }
  
  export function utilToSnakeFormat (value: string): string {
    if (!value) return '';
    return value.toString().toLowerCase().replace(/[\s-]/g, '_').replace('&', 'and');
  }
  
  export function utilToTitleFormat (value: string): string {
    if (!value) return '';
    const newVal = value.toLowerCase().replace(/[-_]/g, ' ');
    return newVal.charAt(0).toUpperCase() + newVal.slice(1);
  }
  
  export function utilFromCamelToTitleFormat (str: string) {
    let returnedStr = '';
    [].forEach.call(str, (char: string, i) => {
      if (i === 0) {
        returnedStr += char.toUpperCase();
      } else if (char === char.toUpperCase()) {
        returnedStr += ` ${char}`.toLowerCase();
      } else {
        returnedStr += char;
      }
    });
    return returnedStr;
  }
  
  export function utilFragmentedString (str: string, insertObj: { [key: string]: string|number } = {}) {
    let newStr = str;
    Object.entries(insertObj).forEach(([key, val]: [string, string|number]) => {
      newStr = newStr.replace(RegExp(`%%${key}%%`, 'ig'), String(val));
    });
    return newStr;
  }
  
  export function utilNumberWithZero (num: string | number, count = 2) {
    const numNumber = Number(num);
    if (numNumber === 0 || Number.isNaN(numNumber)) {
      return '0'.repeat(count);
    }
    const numString = String(num);
    const repeatCount = count - numString.length;
    return repeatCount > 0
      ? `${'0'.repeat(repeatCount)}${numString}`
      : numString;
  }
  
  interface CutStrArgs {
    limit?: number;
    skipStr?: string;
    from?: 'start'|'end';
  }
  
  export function utilCutStringAnvanced (str: string, args: CutStrArgs|undefined) {
    if (!str || typeof str !== 'string') return '';
  
    const {
      limit = 100,
      skipStr = '...',
      from = 'start',
    } = args || {};
  
    const admiss = skipStr.length;
  
    const getCutted = () => {
      return from === 'end'
        ? `${skipStr}${str.substr(-limit)}`
        : `${str.substr(0, limit)}${skipStr}`;
    };
  
    const validLimit = limit + admiss;
    const validStr = str.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
    return (validStr.length > validLimit) ? getCutted() : str;
  }
  
  export function utilCutString (str = '', limit = 100) {
    return utilCutStringAnvanced(str, {
      skipStr: '...',
      limit,
      from: 'start',
    });
  }
  
  export function utilSkippedString (str = '', countStart = 4, countEnd = 4) {
    if (!str) return str;
    const skipStr = '...';
    if (str.length <= countStart + countEnd + skipStr.length) return str;
    return `${str.slice(0, countStart)}...${str.slice(-countEnd)}`;
  }
  
  export function utilHiddenSymbolsString (str: string, obviousFromStart = 0, obviousFromEnd = 0, symbol = '*') {
    const myArr: string[] = [];
    str.split('').forEach((letter: string, index: number) => {
      const isUseSymbol = (index < str.length - obviousFromEnd) &&
        (index > obviousFromStart - 1);
      myArr.push(isUseSymbol ? symbol : letter);
    });
    return myArr.join('');
  }
  
  export function utilTransformCamelCaseWord (word: string) {
    return word
      ?.match(/([A-Z]+(?=[A-Z][a-z]|$)|[A-Z]?[a-z]+)/g)
      ?.map((item: string, i: number) => {
        if (item === item.toUpperCase() && item.length > 1) return item;
        const firstLetter = i === 0
          ? item.charAt(0).toUpperCase()
          : item.charAt(0).toLowerCase();
        return firstLetter + item.slice(1);
      })
      .join(' ');
  }
  
  export function utilStringFromArray (arr: { [key: string]: string }[]) {
    return (Array.isArray(arr) ? arr : [])
      .map(item => `${item?.title}: ${item?.description}`)
      .join('\n');
  }
  
  export function utilUrlify (text: string, textColor?: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const defaultTextColor = 't-text-secondaryItems';
    return text.replace(urlRegex, function (url: string) {
      return `<a class="${textColor || defaultTextColor} t-underline" href="${url}" target="_blank">${url}</a>`;
    });
  }
  
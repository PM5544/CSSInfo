const replacers = [
  {from: /{/g, to: '{\n\t'},
  {from: /;\s}/g, to: '@@@'},
  {from: /;/g, to: ';\n\t'},
  {from: /@@@/g, to: ';\n}'}
];

export function getDomain (location) {
  const match = /^(.*?\w)\/{1}\w/.exec(location);
  if (match && match[1]) {
    return match[1];
  }
}
export const arraySlice = Array.prototype.slice;

export function format (str) {
  replacers.forEach((replacer)=>{
    str = str.replace(replacer.from, replacer.to);
  });
  return str;
}

export function specificitySort (a,b) {
  const aSpec = a.specificity;
  const bSpec = b.specificity;

  for ( let i = 0, len = aSpec.length; i < len; i++  ) {
    if ( aSpec[ i ] !== bSpec[ i ] ) {
      if ( aSpec[ i ] > bSpec[ i ] ) {
        return -1;
      } else {
        return 1;
      }
    }
  }
  return 0;
}

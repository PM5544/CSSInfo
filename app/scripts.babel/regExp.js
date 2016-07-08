import {combinatorsMap} from './settings';

export const upperCase           = /([A-Z]){1}/g;
export const selectorSplitter    = /\s*,\s*/g;
export const stylesSplitter      = /;\s*/g;
export const styleSplitter       = /:\s*/g
export const semicolonInBrackets = /\((.*?);(.*?\))/g;
export const stylesText          = /{(.*)}/;
export const selectorPart        = /\s+|\s?(>)\s?/;

export const combinators         = new RegExp( '^\\' + Object.keys(combinatorsMap).join('$|^\\')+ '$','g');

export const idSpecificity       = /#[a-zA-Z0-9-_]+/g;
export const classSpecificity    = /(\.|:)[a-zA-Z0-9-_]+/g;
export const elementSpecificity  = /\s*[a-zA-Z0-9-_]+/g;
export const important           = /!important/g;

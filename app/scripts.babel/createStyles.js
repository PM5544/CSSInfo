import { Style } from './classes/Style';
import * as regExp from 'regExp';

const replacer = '-_@@#@@_-';

export default function (stylesText) {
  let splitStylesText = stylesText.split(regExp.semicolonInBrackets).join(replacer);
  splitStylesText = stylesText.split(regExp.stylesSplitter);
  splitStylesText.map(str => str.replace(replacer, ';'));
  splitStylesText.pop();

  return splitStylesText.map((styleText ) => {
    let styleSplit = styleText.split(regExp.styleSplitter);
    return new Style(styleSplit[0], styleSplit[1]);
  });
}

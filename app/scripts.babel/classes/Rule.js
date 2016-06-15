import { rules } from '../stores';
import { Style } from './Style';
import { Selector } from './Selector';
import * as regExp from 'regExp';
import { specificitySort } from '../utils';

let domPosition = 0;
const replacer = '-_@@#@@_-';

export class Rule {
  constructor (cssStyleRule) {
    this.cssText = cssStyleRule.cssText;
    this.selectorText = cssStyleRule.selectorText;
    this.domPosition = domPosition++;

    let selectorsTexts = this.selectorText.split(regExp.selectorSplitter);
    this.selectors = selectorsTexts.map(selector => new Selector(selector, this.domPosition, this));

    if (1<this.selectors.length) {
      this.selectors.sort(specificitySort);
    }

    this.stylesText = cssStyleRule.style.cssText;

    let splitStylesText = this.stylesText.split(regExp.semicolonInBrackets).join(replacer);
    splitStylesText = this.stylesText.split(regExp.stylesSplitter);
    splitStylesText.map((str)=>str.replace(replacer, ';'));
    splitStylesText.pop();

    this.styles = splitStylesText.map((styleText ) => {
      let styleSplit = styleText.split(':');
      return new Style(styleSplit[0], styleSplit[1]);
    });


    this.appliedStyles = [];
    let styles = cssStyleRule.style;
    for ( let i = styles.length - 1; i >= 0; i-- ) {
      let propertyName = styles[i];
      this.appliedStyles.push(new Style(propertyName, styles[propertyName]));
    }

    rules.push(this);
  }
}

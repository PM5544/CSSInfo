import { Base } from './Base';
import { rules } from '../stores';
import { Style } from './Style';
import { Selector } from './Selector';
import * as regExp from 'regExp';
import { specificitySort } from '../utils';
import createStyles from '../createStyles';
import createAppliedStyles from '../createAppliedStyles';

let domPosition = 0;

export class Rule extends Base {
  constructor (cssStyleRule) {
    super(cssStyleRule);

    this.type = cssStyleRule.type;
    this.cssText = cssStyleRule.cssText;
    this.selectorText = cssStyleRule.selectorText;
    this.domPosition = domPosition++;

    let selectorsTexts = this.selectorText.split(regExp.selectorSplitter);
    this.selectors = selectorsTexts.map(selector => new Selector(selector, this.domPosition, this));

    if (1 < this.selectors.length) {
      this.selectors.sort(specificitySort);
    }
    if ('undefined' !== typeof cssStyleRule.stylesText) {
      this.stylesText = cssStyleRule.stylesText;
    } else {
      this.stylesText = cssStyleRule.style.cssText;
    }

    this.styles = createStyles(this.stylesText);
    this.appliedStyles = createAppliedStyles(cssStyleRule.appliedStyles || cssStyleRule.style);

    rules.push(this);
  }
}

export function resetDomPosition () {
  domPosition = 0;
}

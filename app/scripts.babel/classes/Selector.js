import * as regExp from 'regExp';
import { arraySlice } from '../utils';
import { selectors } from '../stores';

const selectorCache = {};
export class Selector {
  constructor (selector, index, rule) {
    this.selector = selector;
    this.domPosition = index;

    this.specificity = this.getSpecificity();

    this.parts = Selector.getMatchingNodesPerSelectorPart(this.selector);

    this.rule = rule;
    selectors.push(this);
  }

  getSpecificity () {
    let str = '' + this.selector;

    // check the number id ids in the selector
    let ids  = str.match( regExp.idSpecificity );
    if ( ids ) {
      str = str.replace( regExp.idSpecificity, ' ' );
    }

    // check the number of classes and pseudo classes used in this selector
    let classes = str.match( regExp.classSpecificity );
    if ( classes ) {
      str = str.replace( regExp.classSpecificity, ' ' );
    }

    // check the number of element selectors classes used in this selector
    let elements = str.match( regExp.elementSpecificity );

    return [
      ids         ? ids.length        : 0, // number of id's in this selector
      classes     ? classes.length    : 0, // number of classes in this selector
      elements    ? elements.length   : 0, // number of element selectors in this selector
      this.domPosition // index of the stylesheet this rule is in and the index of this styleRule within that sheet
    ];
  }

  static getMatchingNodesPerSelectorPart (selector) {
    const splitSelector = selector.split(regExp.selectorPart);
    const parts = [];
    const allMatches = arraySlice.call(document.querySelectorAll(selector));

    let formerSelector = '';
    let combinator = undefined;

    splitSelector.forEach((selectorPart) => {
      if (!selectorPart) {
        return;
      } else if (regExp.combinators.test(selectorPart)) {
        formerSelector += ( ' ' + selectorPart );
        return;
      }

      const unfiltered = Selector.getNumberOfMatchingNodes(selectorPart);
      formerSelector += (formerSelector.length ? ' '  : '' ) + selectorPart;
      const matchCount = Selector.getNumberOfMatchingNodes(formerSelector);

      parts.push({
        selectorPart,
        selector: formerSelector,
        unfiltered,
        matchCount,
        combinator
      });

      combinator = undefined;
    });

    parts[parts.length - 1].allMatches = allMatches;

    return parts;
  }
  static getNumberOfMatchingNodes (selector) {
    if (!(selector in selectorCache)) {
      selectorCache[selector] = arraySlice.call(document.querySelectorAll(selector)).length;
    }
    return selectorCache[selector];
  }
}

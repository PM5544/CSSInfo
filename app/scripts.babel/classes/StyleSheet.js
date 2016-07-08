import { Base } from './Base';
import { sheets, xDomainSheets, sheetsFromOtherDomains } from 'stores';
import createRules from '../createRules';

import { arraySlice, getDomain } from '../utils';

export class StyleSheet extends Base {
  constructor (styleSheet) {
    super(styleSheet);

    const sheet = styleSheet.sheet;
    const cssRules = sheet.cssRules;
    this.type = styleSheet.localName;
    if (styleSheet.href) {
      const oldUri = styleSheet.getAttribute('data-url');
      if (oldUri) {
        this.href = oldUri;
      } else {
        this.href = styleSheet.href;
      }
    }
    this.rules = createRules(cssRules);
    sheets.push(this);
  }
}


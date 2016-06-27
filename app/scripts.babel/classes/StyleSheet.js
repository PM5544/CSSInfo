import { Base } from './Base';
import { sheets, xDomainSheets, sheetsFromOtherDomains } from 'stores';
import createRules from '../createRules';

import { arraySlice, getDomain } from '../utils';

export class StyleSheet extends Base {
  constructor (styleSheet) {
    super(styleSheet);

    const sheet = styleSheet.sheet || {};
    const cssRules = sheet.cssRules || [];
    this.type = styleSheet.localName;
    if (styleSheet.href) {
      this.href = styleSheet.href;
    }

    if ( (sheet && cssRules && cssRules.length ) || !this.href ) {
      this.rules = createRules(cssRules);
      sheets.push(this);
    } else {
      if (this.href in sheetsFromOtherDomains) {
        if (sheetsFromOtherDomains[this.href]) {
          this.rules = createRules(sheetsFromOtherDomains[this.href]);
          sheets.push(this);
        }
      } else {
        const domain = getDomain(this.href);
        if (!(domain in xDomainSheets)) {
          xDomainSheets[domain] = [];
        }
        xDomainSheets[domain].push(this.href);
      }
    }
  }
}


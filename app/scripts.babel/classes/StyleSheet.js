import { sheets } from 'stores';
import { Rule } from './Rule';
import { arraySlice } from '../utils';

export class StyleSheet {
  constructor (styleSheet) {
    this.sheet = styleSheet.sheet;

    if ( this.sheet && this.sheet.cssRules && this.sheet.cssRules.length) {
      this.rules = arraySlice.apply( this.sheet.cssRules ).map((rule, index)=>{
        if (1 === rule.type) {
          return new Rule(rule, index)
        }
      });

      sheets.push(this);
    } else {
      console.info('cross domain stylesheet don\'t allow reading cssRules...');
    }
  }
}


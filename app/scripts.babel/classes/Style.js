import * as regExp from '../regExp';
import { shorthandCache, availableProperties } from '../stores';

export class Style {
  constructor (name, value) {
    this.name = name;
    this.value = value;
    this.important = regExp.important.test(this.value);
    this.isShortHand = Style.isShorthand(this.name);
  }

  static isShorthand (propertyName) {
    if ('undefined' === typeof shorthandCache[propertyName]) {
      const splitProperty = propertyName.split('-').filter((val)=>!!val);
      if ( 1 === splitProperty.length) {
        shorthandCache[propertyName] = !!availableProperties[propertyName];
      } else {
        let propertyNamePart = '';
        let propertyObject = availableProperties;

        for (let i = 0, len = splitProperty.length; i < len; i++){
          propertyNamePart += ( propertyNamePart.length ? '-' : '' ) + splitProperty[i];
          if ('undefined' !== typeof propertyObject[splitProperty[i]] && 'undefined' !== typeof propertyObject[propertyNamePart] ) {
            propertyObject = propertyObject[splitProperty[i]] || propertyObject[propertyNamePart];
            shorthandCache[propertyNamePart] = !!propertyObject;
          } else {
            shorthandCache[propertyNamePart] = false;
          }
        }
      }
    }

    return shorthandCache[propertyName];
  }
}

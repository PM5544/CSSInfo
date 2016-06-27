import { Base } from './Base';
import * as regExp from '../regExp';
import { shorthandCache } from '../stores';
import { availableProperties } from '../shorthand';

export class Style extends Base {
  constructor (name, value) {
    super(name, value);

    if (!value) {
      let styleObject = name;
      this.name = styleObject.name;
      this.value = styleObject.value;
      this.important = styleObject.important;
      this.isShorthand = styleObject.isShorthand;
    } else {
      this.name = name;
      this.value = value;
      this.important = regExp.important.test(this.value);
      this.isShorthand = Style.isShorthand(this.name);
    }
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

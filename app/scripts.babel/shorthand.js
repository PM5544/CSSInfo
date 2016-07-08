import { shortHandOverrides } from './settings';
import * as regExp from './regExp';

const shortHandOverridesMap = {};

export const availableProperties = {};

function normalize (currentObject, currentProperty, parentObject, parentProperty ) {
  if (!currentObject) {
    if ( 'undefined' !== typeof currentProperty && 'undefined' !== typeof parentObject && 'undefined' !== typeof parentProperty && 2 === Object.keys(parentObject).length ) {
      const parent = parentObject._parent;
      parent[parentProperty + '-' + currentProperty ] = undefined;
      delete parent[parentProperty];
    }
    return;
  }
  Object.keys(currentObject).forEach(key => key === '_parent' ? undefined : normalize(currentObject[key], key, currentObject, currentProperty));
  delete currentObject._parent;
}

shortHandOverrides.forEach(prop => shortHandOverridesMap[prop] = undefined);
if ('iframe' !== environmentChecks()) {
  Object.keys(document.documentElement.style).forEach(property => {
    let ob = availableProperties;
    let prevOb;
    let prevPropertyPart;
    let prefix = '';
    const propertyParts = property.split(regExp.upperCase).filter(val=>!!val);

    propertyParts.forEach((_propertyPart, index, array) => {

      let propertyPart = _propertyPart.toLowerCase();
      if (1 === propertyPart.length) {
        prefix += propertyPart;
        if (index !== ( array.length - 1 ) ) {
          return;
        }
      } else {
        propertyPart = prefix + propertyPart;
        prefix = '';
      }

      if (propertyPart in shortHandOverridesMap) {
        if (index !== ( array.length - 1 ) ) {
          prefix = propertyPart + '-';
          return;
        }
      }

      if (!ob){
        ob = prevOb[prevPropertyPart] = {
          _parent: prevOb
        };
      }

      if (!(propertyPart in ob)) {
        ob[propertyPart] = undefined;
      }
      prevOb = ob;
      prevPropertyPart = propertyPart;
      ob = ob[propertyPart];
    });
  });
  normalize(availableProperties);
}

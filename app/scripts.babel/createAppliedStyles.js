import { Style } from './classes/Style';

export default function (styles) {
  const appliedStyles = [];
  for ( let i = styles.length - 1; i >= 0; i-- ) {
    let propertyName = styles[i];
    appliedStyles.push(new Style(propertyName, styles[propertyName]));
  }
  return appliedStyles;
}

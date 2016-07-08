import { StyleSheet } from './classes/StyleSheet';
import { specificitySort, arraySlice, getDomain } from './utils';
import normalizeSheet from './normalizeSheet';
import { sheets, rules, shorthandCache, selectors, xDomainSheets, sheetsFromOtherDomains } from './stores';
import analysers from './analysers';
import overlay from './overlay';
import runAnalysers from './runAnalysers';
import { resetDomPosition } from './classes/Rule';


function parse () {
  const styleSheets = arraySlice.apply(document.querySelectorAll('link[rel=\'stylesheet\'], style'));
  sheets.length = 0;
  rules.length = 0;
  resetDomPosition();

  styleSheets.forEach((styleSheet) => {
    new StyleSheet(styleSheet);
  });

  rules.sort((a,b) => {
    return specificitySort(a.selectors[0],b.selectors[0]);
  });

  runAnalysers()
    .then((responses) => {
      responses.map(response => console.log(response));
    })
  ;
}
export default function generateRules () {

  const links = arraySlice.apply(document.querySelectorAll('link[rel=\'stylesheet\']'));

  if (links.length) {
    // we first normalize all cross domain sheets so we can access their styles
    Promise.all(links.map((link) => {
      return normalizeSheet(link);
    })).then((res) => {
      parse();
    });
  } else {
    parse();
  }

}

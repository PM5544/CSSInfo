import { StyleSheet } from './classes/StyleSheet';
import { specificitySort, arraySlice, getDomain } from './utils';
import createIfFrame from './createIfFrame';
import createStyleSheetsInIframe from './createStyleSheetsInIframe';
import { sheets, rules, shorthandCache, selectors, xDomainSheets, sheetsFromOtherDomains } from './stores';
import analysers from './analysers';
import overlay from './overlay';
import runAnalysers from './runAnalysers';
import { resetDomPosition } from './classes/Rule';
import { addTopReceivingMessageListener } from './message';

export default function generateRules () {

  let styleSheets = document.querySelectorAll('link[rel=\'stylesheet\'], style');
  const _styleSheets = arraySlice.apply( styleSheets );
  sheets.length = 0;
  rules.length = 0;
  resetDomPosition();

  Object.keys(xDomainSheets).forEach((xDomain)=>{
    delete xDomainSheets[xDomain];
  });

  _styleSheets.forEach((styleSheet) => {
    new StyleSheet(styleSheet);
  });

  const xDomains = Object.keys(xDomainSheets);
  if (xDomains.length) {

    const topDomain = getDomain(document.location.href);

    addTopReceivingMessageListener();

    xDomains.forEach((domain) => {
      const sheetURIs = xDomainSheets[domain];

      sheetURIs.forEach((sheetURI) => {
        sheetsFromOtherDomains[sheetURI] = undefined;
      });

      createIfFrame({
        topDomain,
        domain,
        sheetURIs
      });
    });
  } else {

    let allDone = true;
    Object.keys(sheetsFromOtherDomains).forEach((uri) => {
      if (!sheetsFromOtherDomains[uri]) {
        allDone = false;
      }
    });

    if (allDone) {
      rules.sort((a,b) => {
        return specificitySort(a.selectors[0],b.selectors[0]);
      });
      runAnalysers()
        .then((responses) => {
          responses.map(response => console.log(response));
        })
      ;
    }
  }

}

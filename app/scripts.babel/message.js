import { sheetsFromOtherDomains } from './stores';
import generateRules from './generateRules';
import createStyleSheetsInIframe from './createStyleSheetsInIframe';

let addedReturnMessage = false;

export function addTopReceivingMessageListener () {
  if (!addedReturnMessage) {
    addedReturnMessage = true;

    window.addEventListener('message', (e) => {
      const { rules, sheetURI } = e.data;
      if (rules && sheetURI) {
        sheetsFromOtherDomains[sheetURI] = rules;
        generateRules();
      }
    }, false);
  }
}

export function addIframeReceivingMessageListener () {
  window.addEventListener('message', createStyleSheetsInIframe, false);
}

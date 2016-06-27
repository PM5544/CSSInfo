import { StyleSheet } from './classes/StyleSheet';
import * as regExp from 'regExp';
import { specificitySort, arraySlice, getDomain } from './utils';
import createIfFrame from './createIfFrame';
import overlay from './overlay';
import generateRules from './generateRules';
import environmentChecks from './environmentChecks';
import { addIframeReceivingMessageListener } from './message';

const mode = environmentChecks();

switch (mode) {

case 'iframe':
  if ( '?css-info=true' === window.location.search) {
    addIframeReceivingMessageListener();
  }
  break;

default:
  generateRules();
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request,sender, sendResponse);
    if( request.message === 'clicked_browser_action' ) {
      let overlay = document.getElementById('cssinfo');
      overlay.style.display = 'block';
    }
  }
);

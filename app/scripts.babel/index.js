import * as regExp from 'regExp';
import { specificitySort, arraySlice, getDomain } from './utils';
import overlay from './overlay';
import generateRules from './generateRules';

generateRules();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request,sender, sendResponse);
    if( request.message === 'clicked_browser_action' ) {
      let overlay = document.getElementById('cssinfo');
      overlay.style.display = 'block';
    }
  }
);



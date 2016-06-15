import { StyleSheet } from './classes/StyleSheet';
import * as regExp from 'regExp';
import { specificitySort, arraySlice } from './utils';
import { sheets, rules, shorthandCache, selectors } from './stores';
import { availableProperties }  from './shorthand';
import analysers from './analysers';
import overlay from './overlay';

import environmentChecks from './environmentChecks';

const mode = environmentChecks();

let styleSheets = document.querySelectorAll('link[rel=\'stylesheet\'], style');

function generateRules () {
  const _styleSheets = arraySlice.apply( styleSheets );
  sheets.length = 0;
  rules.length = 0;

  _styleSheets.forEach((styleSheet) => {
    new StyleSheet(styleSheet);
  });

  rules.sort((a,b) => {
    return specificitySort(a.selectors[0],b.selectors[0]);
  });
}

function runAnalysers () {

  return Promise.all(analysers.map((fn)=>fn({rules,selectors})))
    .then((res)=> res, (err)=>{
      console.error(err);
    })
  ;
}

console.log('running in ' + mode + ' mode');
switch (mode) {

case 'iframe':
  console.log('running in ifame!');
  break;

default:
  generateRules();
  //runAnalysers().then(overlay);
  runAnalysers().then((results)=>{
    results.map(result => Object.keys(result).forEach(key => console.log(result[key])));
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === 'clicked_browser_action' ) {

      let overlay = document.getElementById('cssinfo');
      overlay.style.display = 'block';
    }
  }
);

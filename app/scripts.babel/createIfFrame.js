import { sheetsFromOtherDomains } from './stores';
import generateRules from './generateRules';

const nonExisting = '/_-=cssInfo=-_/a/folder/that/probably/does/not/exist/anywhere/on/this/domain/?css-info=true';
function setupPostMessage (iframe, data) {

  window.setTimeout( () => {
    let defaulted = false;
    data.sheetURIs.forEach((uri) => {
      if ( 'undefined' === typeof sheetsFromOtherDomains[uri] ) {
        sheetsFromOtherDomains[uri] = [];
        defaulted = true;
      }
    });
    if (defaulted) {
      generateRules();
    }
  }, 3000);

  const contentWindow = iframe.contentWindow;
  window.setTimeout(() => {
    contentWindow.postMessage(data, data.domain);
  }, 1000);

}

export default function (params) {
  const {topDomain, domain, sheetURIs} = params;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('data-css-info','\\o/');
  iframe.addEventListener('load', (e) => {
    setupPostMessage(e.target, {
      topDomain,
      domain,
      sheetURIs
    });
  }, false);

  iframe.src = domain + nonExisting;
  document.body.appendChild(iframe);
}

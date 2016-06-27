import {arraySlice} from './utils';
import createRules from './createRules';

function createStyleSheet (uri) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = uri;
  return link;
}

export default function (e) {
  const { topDomain, domain, sheetURIs } = e.data;
  let sheetCount;
  if (topDomain && domain && sheetURIs) {
    sheetCount = sheetURIs.length;

    const head = document.querySelector('head');

    sheetURIs.forEach((sheetURI) => {
      const link = createStyleSheet(sheetURI);
      link.addEventListener('load', (e) => {
        const sheet = e.target.sheet;

        if (sheet && sheet.cssRules) {
          const rules = createRules(sheet.cssRules);

          top.postMessage({
              sheetURI: e.target.href,
              rules
            },
            topDomain
          );
        }
      });
      head.appendChild(link);
    });
  }
}

import {arraySlice} from './utils';
import createRules from './createRules';

export default function (link) {
  return new Promise((resolve, reject) => {
    const { sheet: {cssRules, rules} } = link;

    if (null !== rules ) {
      resolve(link.sheet);
    } else {
      const newLink = document.createElement('link');
      newLink.setAttribute('rel', 'stylesheet');
      newLink.setAttribute('data-url', link.href);

      newLink.addEventListener('load',() => {
        resolve(newLink.sheet);
      });

      const xhr = new XMLHttpRequest();
      xhr.open('GET', link.href, true);
      xhr.responseType = 'blob';
      xhr.addEventListener('error',(err) => {
        reject(err);
      });


      xhr.addEventListener('load', () => {
        link.parentNode.replaceChild(newLink, link);

        var blob = new Blob([xhr.response],{type: 'text/css'});
        newLink.href = window.URL.createObjectURL(blob);
      });

      xhr.send();
    }
  });
}

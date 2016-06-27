import analysers from './analysers';
import { sheets, rules, selectors } from './stores';

export default function () {
  return Promise.all(analysers.map(fn => fn({rules, selectors, sheets})))
    .then(
      res => res,
      err => {
        console.error(err);
      }
    );
  ;
}

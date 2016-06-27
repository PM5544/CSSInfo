import { arraySlice } from './utils';
import { Rule } from './classes/Rule';
import { Media } from './classes/Media';
import { Supports } from './classes/Supports';
import { FontFace } from './classes/FontFace';

export default function (rules) {
  return arraySlice.apply( rules ).map(rule => {
    switch (rule.type) {
    case 1:
      return new Rule(rule);

    case 4:
      return new Media(rule);

    case 5:
      return new FontFace(rule);

    case 7:
      // keyframeRule
      return;

    case  12:
      return new Supports(rule);

    default:
      debugger;
      return;
    }
  });
};

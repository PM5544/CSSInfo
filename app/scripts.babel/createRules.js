import { arraySlice } from './utils';
import { Rule } from './classes/Rule';
import { Media } from './classes/Media';
import { Supports } from './classes/Supports';
import { FontFace } from './classes/FontFace';

export default function (rules) {
  return arraySlice.apply( rules ).map(rule => {
    // like found on https://wiki.csswg.org/spec/cssom-constants
    switch (rule.type) {
    case 1:
      return new Rule(rule);

    case 2:
      break; // charset rule

    case 3:
      break; // import rule

    case 4:
      return new Media(rule);

    case 5:
      return new FontFace(rule);

    case 6:
      break; // page rule

    case 7:
      return; // keyframes rule

    case 8:
      break; // keyframe rule

    case 9:
      break; // margin rule

    case 10:
      break; // namespace rule

    case 11:
      break; // counter rule

    case  12:
      return new Supports(rule);

    case 13:
      break; // document rule

    case 14:
      break; // font feature rule

    case 15:
      break // viewport rule

    case 16:
      break; // region style rule

    case 17:
      break; //custom media rule

    default:
      return;
    }
  });
};

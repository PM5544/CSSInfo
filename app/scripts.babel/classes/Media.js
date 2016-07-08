import { Base } from './Base';
import createRules from '../createRules';

export class Media extends Base {
  constructor (cssStyleRule) {
    super(cssStyleRule);

    this.type = cssStyleRule.type;
    this.cssText = cssStyleRule.cssText;
    this.mediaList = [];
    let media = cssStyleRule.mediaList || cssStyleRule.media;
    for ( let i = media.length - 1; i >= 0; i-- ) {
      this.mediaList.push(media[i]);
    }
    this.mediaText = cssStyleRule.mediaText || media.mediaText;

    this.rules = createRules(cssStyleRule.cssRules || cssStyleRule.rules);
  }
}

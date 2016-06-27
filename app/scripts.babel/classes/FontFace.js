import { Base } from './Base';
import createStyles from '../createStyles';
import createAppliedStyles from '../createAppliedStyles';

export class FontFace extends Base{
  constructor (cssStyleRule) {
    super(cssStyleRule);

    this.type = cssStyleRule.type;
    this.cssText = cssStyleRule.cssText;
    this.stylesText = cssStyleRule.stylesText || cssStyleRule.style.cssText;
    this.styles = createStyles(this.stylesText);
    this.appliedStyles = createAppliedStyles(cssStyleRule.appliedStyles || cssStyleRule.style);
  }
}

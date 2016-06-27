import { Base } from './Base';
import createRules from '../createRules';

export class Supports extends Base {
  constructor (supportsRule) {
    super(supportsRule);

    this.type = supportsRule.type;
    this.cssText = supportsRule.cssText;
    this.conditionsText = supportsRule.conditionText;
    this.rules = createRules(supportsRule.rules || supportsRule.cssRules);
  }
}

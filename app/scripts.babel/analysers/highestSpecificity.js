import { format } from '../utils';

export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    let rule = rules[0];
    let highest = rule.selectors[0].specificity;

    let formatted = format(rule.cssText);
    resolve({
      title: 'Highest specificity',
      value: `ids: ${highest[0]}, classes: ${highest[1]}, elements: ${highest[2]}, position: ${highest[3]}`,
      html: `<pre>${formatted}</pre>`
    });
  });
};

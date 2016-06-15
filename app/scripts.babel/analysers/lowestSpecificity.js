import { format } from '../utils';

export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    let rule = rules[rules.length - 1 ];
    let selectors = rule.selectors;
    let selector = selectors[selectors.length - 1];
    let lowest = selector.specificity;
    let formatted = format(rule.cssText);

    resolve({
      title: 'Lowest specificity',
      value: `ids: ${lowest[0]}, classes: ${lowest[1]}, elements: ${lowest[2]}, position: ${lowest[3]}`,
      html: `<pre>${formatted}</pre>`
    });
  });
};

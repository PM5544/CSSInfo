import { format } from '../utils';

export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    let mostStyles = 0;
    let ruleWithMostStyles;
    rules.forEach((rule) => {
      let styleLength = rule.styles.length;
      if (styleLength > mostStyles) {
        mostStyles = styleLength;
        ruleWithMostStyles = rule;
      }
    });

    let formatted = format(ruleWithMostStyles.cssText);
    resolve({
      title: 'Most styles per styleRule',
      value: mostStyles,
      html: `<pre>${formatted}</pre>`
    });
  });
};

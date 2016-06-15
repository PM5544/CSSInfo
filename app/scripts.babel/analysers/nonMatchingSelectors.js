export default function (params) {
  const {rules, selectors} = params;

  return new Promise((resolve, reject) => {
    const nonMatching = [];

    selectors.forEach((selector) => {
      if (0 === selector.parts[selector.parts.length - 1 ].matchCount) {
        nonMatching.push( selector );
      }
    });
    resolve({
      title: 'styleRules with no matching nodes: ' + nonMatching.length,
      value: nonMatching
    });
  });
};

export default function (params) {
  const {rules, selectors} = params;

  return new Promise((resolve, reject) => {
    let longestCount = 0;
    let longest;

    selectors.forEach((selector) => {
      if (selector.parts.length >= longestCount) {
        longestCount = selector.parts.length;
        longest = selector;
      }
    });
    resolve({
      title: 'Deepest nested selector',
      value: longest
    });
  });
};

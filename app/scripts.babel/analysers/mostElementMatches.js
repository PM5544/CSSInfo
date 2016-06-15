export default function (params) {
  const {rules, selectors} = params;

  return new Promise((resolve, reject) => {
    let mostElementMatchesCount = 0;
    let mostElementMatches;

    selectors.forEach((selector) => {
      if (selector.parts[selector.parts.length - 1 ].allMatches.length >= mostElementMatchesCount) {
        mostElementMatchesCount = selector.parts[selector.parts.length - 1 ].allMatches.length;
        mostElementMatches = selector;
      }
    });
    resolve({
      title: 'most matched elements',
      value: mostElementMatches
    });
  });
};

export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    let importants = 0;
    rules.forEach((rule)=>{
      rule.styles.forEach((style) => {
        if (style.important) {
          importants++;
        }
      });
    });
    resolve({
      title: 'Number of !importants',
      value: importants
    });
  });
};

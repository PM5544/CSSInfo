export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    resolve({
      title: 'Number of rules',
      value: rules.length
    });
  });
};

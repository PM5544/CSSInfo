export default function (params) {
  const {rules, selectors} = params;
  return new Promise((resolve, reject) => {
    const colors = {};
    rules.forEach((rule)=>{
      rule.styles.forEach((style) => {
        if ('color' === style.name) {
          colors[style.value] = true;
        }
      });
    });
    let uniqueColors = Object.keys(colors);
    resolve({
      title: 'Number of colors',
      value: uniqueColors.length,
      html: uniqueColors.map((color)=>`<span style="background-color: ${color}; width: 10px; height: 10px; display: inline-block;"></span>`).join(' ')
    });
  });
};

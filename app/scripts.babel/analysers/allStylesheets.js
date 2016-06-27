export default function (params) {
  const {sheets} = params;

  return new Promise((resolve, reject) => {
    resolve({
      title: 'all stylesheets',
      value: sheets
    });
  });
};

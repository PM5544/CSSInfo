let env;

export default function () {
  if ('undefined' !== typeof env) {
    return env;
  }

  if (window && top && window === top) {
    env = 'default';
  }

  if (window !== top) {
    env = 'iframe';
  }

  return env;
};

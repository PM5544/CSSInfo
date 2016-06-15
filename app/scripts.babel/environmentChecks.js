export default function () {
  if (window && top && window === top) {
    return 'default';
  }
  if (window !== top) {
    return 'iframe';
  }
};

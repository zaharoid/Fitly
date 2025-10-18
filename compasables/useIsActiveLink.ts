function getPathFromEl (linkObj: any) {
  if (!linkObj) return '';
  let uri = linkObj?.pathname || '';
  if (uri.substr(-1, 1) === '/') uri = uri.slice(0, -1);
  return uri;
}
function getCurrentPath () {
  const route = useRoute();
  return route.path;
}

function isChildUri (thisUri: string, relatedUri: string) {
  if (!relatedUri) return false;
  const myReg = new RegExp(`^${relatedUri}(/[^/]*)*$`, 'i');
  return Boolean(thisUri.match(myReg));
}

export function useIsActiveLink (el = {}) {
  return isChildUri(getCurrentPath(), getPathFromEl(el));
}

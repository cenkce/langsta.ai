function isNotUtm(param: string) { return param.slice(0, 4) !== 'utm_'; }

export const clearUtmFromUrl = (urlstr?: string) => {
  if(!urlstr){
    throw 'Empty url string provided';
  }
  const url = new URL(urlstr);
  const params = url.search.slice(1).split('&');
  const newParams = params.filter(isNotUtm);
  if (newParams.length < params.length) {
    const search = newParams.length ? '?' + newParams.join('&') : '';
    const sanitizedUrl = url.pathname + search + location.hash;
    return sanitizedUrl;
  }

  return urlstr;
}

// Convert params from url into JSON object
export default function getParamsFromUrl(url) {
  const params = {};
  const urlObj = new URL(url);
  const { searchParams, hostname } = urlObj;
  if (hostname === 'youtu.be') {
    const { pathname, search } = urlObj;
    const videoId = pathname.substring(1);
    const videoStartTime = search.substring(3);
    params['v'] = videoId;
    if (!isNaN(videoStartTime)) {
      params['t'] = videoStartTime;
    }
  } else {
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }
  return params;
}

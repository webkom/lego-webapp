// Convert params from url into JSON object
const getParamsFromUrl = url => {
  let params = {};
  const urlObj = new URL(url);
  const { searchParams, hostname } = urlObj;
  if (hostname === 'youtu.be') {
    params = handleYoutubeUrl(urlObj, params);
  } else {
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }
  return params;
};

const handleYoutubeUrl = (urlObj, params) => {
  const { pathname, search } = urlObj;
  const videoId = pathname.substring(1);
  const videoStartTime = search.substring(3);
  params['v'] = videoId;
  if (!isNaN(videoStartTime)) {
    params['t'] = videoStartTime;
  }
  return params;
};

export default getParamsFromUrl;

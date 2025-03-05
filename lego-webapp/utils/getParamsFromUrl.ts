// Convert params from url into object
const getParamsFromUrl = (url: string): Record<string, string> => {
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

// Convert special urls on the form "youtu.be/{id}&t={seconds}" into object
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

/**
 * Convert an incoming request to a fetch request
 * Why? The docs did it
 * https://reactrouter.com/en/main/guides/ssr
 */
const createFetchRequest = (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  res.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
};

export default createFetchRequest;

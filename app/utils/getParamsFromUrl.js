// Convert params from url into JSON object
export default function getParamsFromUrl(url) {
  const params = {};
  const { searchParams } = new URL(url);
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

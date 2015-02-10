
export function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

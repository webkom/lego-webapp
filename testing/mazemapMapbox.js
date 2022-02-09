//bypasses jest running in node and not having access to the DOM
window.URL.createObjectURL = function () {};

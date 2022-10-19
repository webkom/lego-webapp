const fetch = require('node-fetch');
const fs = require('fs');

const BASEURL = 'https://api.mazemap.com/js/';
const MAZEMAPJS = 'mazemap.min.js';
const MAZEMAPCSS = 'mazemap.min.css';
const VERSION = 'v2.0.73';

async function downloadFile(url, file) {
  await fetch(url).then(async (response) => {
    const body = await response.text();
    fs.createWriteStream(file).write(body);
  });
}

//* downloads the js and css file */
async function downloadMazemap() {
  const jsFile = './mazemap.min.js';
  const cssFile = './mazemap.min.css';
  const jsUrl = BASEURL + VERSION + '/' + MAZEMAPJS;
  const cssUrl = BASEURL + VERSION + '/' + MAZEMAPCSS;

  //write the file to the filesystem
  await downloadFile(jsUrl, jsFile);
  await downloadFile(cssUrl, cssFile);
}

downloadMazemap();

const path = require('path');
module.exports = {
  sections: [
    {
      name: 'Lego-Webap README',
      content: 'README.md'
    },
    {
      name: 'Components',
      components: 'app/components/**/*.js'
    }
  ],
  defaultExample: true,
  require: [
    'babel-polyfill',
    'app/styles/icomoon.css',
    'app/styles/variables.css',
    'app/styles/globals.css'
  ],
  webpackConfig: require('./config/webpack.client.js'),

  // Add proper import statements
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    const dir = path.dirname(componentPath);
    let import_name = name === 'index'
      ? dir.substr(dir.lastIndexOf('/') + 1)
      : `{ ${name} }`;
    return `import ${import_name} from '${dir}';`;
  }
};

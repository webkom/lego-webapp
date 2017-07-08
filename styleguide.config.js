const path = require('path');

const root = path.resolve(__dirname, '.');

const webpackConfig = require('./config/webpack.client.js');
webpackConfig.resolve.modules.push('lib');
webpackConfig.module.rules.push({
  include: path.resolve(root, 'lib'),
  loader: 'babel-loader'
});

module.exports = {
  sections: [
    {
      name: 'Lego-Webapp README',
      content: 'README.md'
    },
    {
      name: 'Components',
      components: 'app/components/*/*.js'
    },
    {
      name: 'Style guidelines',
      sections: [
        {
          name: 'Content layout',
          content: 'docs/layout.md'
        },
        {
          name: 'Headers',
          content: 'docs/headers.md'
        },
        {
          name: 'Sidebars',
          content: 'docs/sidebars.md'
        },
        {
          name: 'Tables',
          content: 'docs/tables.md'
        },
        {
          name: 'Mobile',
          content: 'docs/mobile.md'
        },
        {
          name: 'Backgrounds',
          content: 'docs/backgrounds.md'
        },
        {
          name: 'List items',
          content: 'docs/list-items.md'
        },
        {
          name: 'Styling',
          sections: [
            {
              content: 'app/styles/README.md'
            },
            {
              name: 'CSS Files',
              content: '.css.tmp.md'
            }
          ]
        },
      ]
    }
  ],
  context: {
    state: 'lib/state_example.js'
  },
  defaultExample: false,
  require: [
    'app/styles/icomoon.css',
    'app/styles/variables.css',
    'app/styles/globals.css'
  ],
  webpackConfig,

  // Show the import statements we use in this project
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    const dir = path.dirname(componentPath);
    let import_name = name === 'index'
      ? dir.substr(dir.lastIndexOf('/') + 1)
      : `{ ${name} }`;
    return `import ${import_name} from '${dir}';`;
  }
};

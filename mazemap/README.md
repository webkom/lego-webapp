# MazeMap JS API NPM Module

### Install as npm/yarn module

- Add these files under a folder, such as vendor/mazemap
- Add local files as as a yarn module, pointing to the folder

`yarn add file:./vendor/mazemap`

### Note:

Make sure you don't have `--ignore-scripts` in your yarn config.

If you do, the `install` script in the package will not run and will not
download the pre-built files from mazemap servers.

Workaround described below.

### Manual file download workaround:

To manually download the prebuilt mazemap source files
go into this folder and manually run `sh install.sh` before doing the `yarn add`

It will then fetch `mazemap.min.js` and `mazemap.min.css` from mazemap servers
and use those files

### Updating the version

You can manually update the version for the js api by changing the version number
in package.json. It is referenced 2 places. You need to change both.

- version attribute
- install scripts command argument

Then, to upgrade already installed package, run
`yarn upgrade mazemap`.

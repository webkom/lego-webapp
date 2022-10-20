# MazeMap JS API NPM Module

### Install as npm/yarn module

- Add these files under a folder, such as vendor/mazemap
- Add local files as as a yarn module, pointing to the folder

`yarn add file:./vendor/mazemap`

### Note:

Make sure you don't have `--ignore-scripts` in your yarn config.

If you do, the `install` script in the package will not run and will not
download the pre-built files from mazemap servers.

### Updating the version

You can manually update the version for the js api by changing the version number
in package.json. Then, to upgrade already installed package, run
`yarn upgrade mazemap`.

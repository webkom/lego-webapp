// flow-typed signature: 0430fa3c32bee88e89756a239fc5c095
// flow-typed version: c6154227d1/slugify_v1.x.x/flow_>=v0.104.x

declare module "slugify" {
  declare type SlugifyOptions = {
    replacement?: string,
    remove?: ?RegExp,
    lower?: boolean,
    ...
  };
  declare module.exports: {
    (input: string, optionOrReplacement?: string | SlugifyOptions): string,
    extend({ [key: string]: string, ... }): void,
    ...
  };
}

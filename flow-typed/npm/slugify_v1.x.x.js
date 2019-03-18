// flow-typed signature: fcefa82e5302cfe96bbeda57c93fcc28
// flow-typed version: 8c429e7eef/slugify_v1.x.x/flow_>=v0.34.x

declare module "slugify" {
  declare type SlugifyOptions = {
    replacement?: string,
    remove?: ?RegExp,
    lower?: boolean
  };
  declare module.exports: {
    (input: string, optionOrReplacement?: string | SlugifyOptions): string,
    extend({ [key: string]: string }): void
  };
}

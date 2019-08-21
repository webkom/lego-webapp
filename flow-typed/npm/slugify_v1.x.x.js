// flow-typed signature: 9a29e7bc0add83448741a921404a7376
// flow-typed version: c6154227d1/slugify_v1.x.x/flow_>=v0.34.x <=v0.103.x

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

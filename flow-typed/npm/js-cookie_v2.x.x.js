// flow-typed signature: aad6a85a62cb80a57d9e73fa787f25c1
// flow-typed version: c6154227d1/js-cookie_v2.x.x/flow_>=v0.38.x <=v0.103.x

declare module 'js-cookie' {
    declare type CookieOptions = {
        expires?: number | Date,
        path?: string,
        domain?: string,
        secure?: boolean
    }
    declare type ConverterFunc = (value: string, name: string) => string;
    declare type ConverterObj = {
        read: ConverterFunc,
        write: ConverterFunc
    };
    declare class Cookie {
        defaults: CookieOptions;
        set(name: string, value: mixed, options?: CookieOptions): void;
        get(...args: Array<void>): { [key: string]: string };
        get(name: string, ...args: Array<void>): string | void;
        remove(name: string, options?: CookieOptions): void;
        getJSON(name: string): Object;
        withConverter(converter: ConverterFunc | ConverterObj): this;
        noConflict(): this;
    }

    declare module.exports: Cookie;
}

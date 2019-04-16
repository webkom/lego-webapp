//@flow

export interface UniversalRaven {
  captureException(ex: Error, options?: Object): *;
  setDataCallback(data: any, orig?: any): *;
  captureException(ex: Error, options?: Object): *;
}

export const createNewRavenInstance = (Raven: any): UniversalRaven =>
  Raven.context(() => new UniversalRavenNode(Raven));

// Mimic raven-js API
export class UniversalRavenNode implements UniversalRaven {
  raven: any;
  dataCallback: any => any = state => state;

  constructor(raven: any) {
    this.raven = raven;
  }
  captureBreadcrumb = (data: any) => this.raven.captureBreadcrumb(data);

  setDataCallback = (callback: any) => (this.dataCallback = callback);

  captureException = (error: Error, extraData: any = {}) => {
    const data = this.dataCallback({
      extra: {},
      ...extraData
    });
    return this.raven.captureException(error, data);
  };
}

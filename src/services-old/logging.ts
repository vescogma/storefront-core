import * as log from 'loglevel';
import { Service } from '../core';
import StoreFront from '../storefront';

export default class Logging extends Service<any> {

  constructor(app: StoreFront) {
    super(Object.assign(app, { log }));
  }

  // tslint:disable-next-line no-empty
  init() { }
}

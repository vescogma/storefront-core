import * as log from 'loglevel';
import { Service } from '../core';
import { core } from '../core/system';
import StoreFront from '../storefront';

@core
export default class Logging implements Service {

  constructor(private app: StoreFront) { }

  init(services: Service.Map) {
    this.app.log = log;
  }
}

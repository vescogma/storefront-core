import { FluxCapacitor } from 'groupby-api';
import { Configuration, Registry, Service, System } from './core';

export default class StoreFront {

  static _instance: StoreFront;

  log: Log;
  flux: FluxCapacitor;
  registry: Registry = new Registry();
  services: { [key: string]: Service<any> };

  constructor(public config: Configuration) {
    if (StoreFront._instance) {
      return StoreFront._instance;
    }

    StoreFront._instance = this;

    const system = new System(this);
    system.initServices();
    system.initMixin();
  }
}

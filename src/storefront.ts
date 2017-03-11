import { FluxCapacitor } from 'groupby-api';
import { Configuration, Service, System } from './core';
import services from './services';

export default class StoreFront {

  static _instance: StoreFront;

  log: Log;
  flux: FluxCapacitor;
  // registry: Registry = new Registry();
  services: Service.Map;

  constructor(public config: Configuration) {
    if (StoreFront._instance) {
      return StoreFront._instance;
    }

    StoreFront._instance = this;

    const system = new System(this);

    system.bootstrap(services);
    system.initServices();
    system.initMixin();
  }
}

import * as riot from 'riot';
import { Configuration, Service } from '.';
import StoreFront from '../storefront';

export const CORE = Symbol('core');
export const core = (target) => { target[CORE] = true; };

export default class System {

  constructor(public app: StoreFront) { }

  /**
   * allow client to modify system before services are initialized
   */
  bootstrap(config: Configuration, services: Service.Constructor.Map) {
    this.app.config = config;

    const servicesConfig = config.services || {};
    const allServices = { ...services, ...System.extractUserServices(servicesConfig) };
    this.app.services = System.buildServices(this.app, allServices, servicesConfig);

    if (typeof config.bootstrap === 'function') {
      config.bootstrap(this.app);
    }
  }

  /**
   * initialize all core and user-defined services
   */
  initServices() {
    Object.keys(this.app.services)
      .forEach((key) => this.app.services[key].init(this.app.services));
  }

  /**
   * initialize the core riot mixin
   */
  initMixin() {
    const { services } = this.app;
    const mixin = { services };

    if (this.app.config.globalMixin) {
      riot.mixin(mixin);
    } else {
      riot.mixin('storefront', mixin);
      riot.mixin('sf', mixin);
    }
  }

  static buildServices(app: StoreFront, services: Service.Constructor.Map, config: any): Service.Map {
    return Object.keys(services)
      .filter((key) => services[key][CORE] || config[key] !== false)
      .reduce((svcs, key) => {
        const serviceConfig = typeof config[key] === 'object' ? config[key] : {};
        return Object.assign(svcs, { [key]: new services[key](app, serviceConfig) });
      }, {});
  }

  static extractUserServices(services: { [key: string]: any }): Service.Constructor.Map {
    return Object.keys(services)
      .filter((key) => typeof services[key] === 'function')
      .reduce((svcs, key) => Object.assign(svcs, { [key]: services[key] }), {});
  }
}

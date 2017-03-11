import { Service } from '.';
import StoreFront from '../storefront';

export const CORE = Symbol('core');
export const core = (target) => { target[CORE] = true; };

export default class System {

  constructor(public app: StoreFront) { }

  /**
   * allow client to modify system before services are initialized
   */
  bootstrap(services: Service.Constructor.Map) {
    const serviceConfig = this.app.config.services || {};
    const allServices = { ...services, ...System.extractUserServices(serviceConfig) };
    this.app.services = Object.keys(allServices)
      .filter((key) => allServices[key][CORE] || serviceConfig[key] !== false)
      .reduce((svcs, key) => {
        const config = typeof serviceConfig[key] === 'object' ? serviceConfig[key] : {};
        return Object.assign(svcs, { [key]: new allServices[key](this.app, config) });
      }, {});

    if (typeof this.app.config.bootstrap === 'function') {
      this.app.config.bootstrap(this.app);
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
  initMixin() { }

  static extractUserServices(services: { [key: string]: any }): Service.Constructor.Map {
    return Object.keys(services)
      .filter((key) => typeof services[key] === 'function')
      .reduce((svcs, key) => Object.assign(svcs, { [key]: services[key] }), {});
  }
}

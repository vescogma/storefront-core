import { Service } from '.';
import StoreFront from '../storefront';

export default class System {

  services: { [key: string]: Service };

  constructor(private app: StoreFront) { }

  /**
   * allow client to modify system before services are loaded
   */
  bootstrap() { }

  /**
   * initialize all core and user-defined services
   */
  initServices() { }

  /**
   * initialize the core riot mixin
   */
  initMixin() { }
}

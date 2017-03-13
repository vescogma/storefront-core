import { Request } from 'groupby-api';
import { Service, Structure } from '.';
import StoreFront from '../storefront';
import DEFAULTS from './defaults';

namespace Configuration {
  export const Transformer = { // tslint:disable-line:variable-name
    transform(rawConfig: Configuration): Configuration {
      const config = Transformer.deprecationTransform(rawConfig);
      const finalConfig = Transformer.applyDefaults(config, DEFAULTS);

      Transformer.validate(finalConfig);

      return finalConfig;
    },

    /**
     * transform to handle graceful deprecation of configuration
     */
    deprecationTransform(config: Configuration): Configuration {
      return config;
    },

    applyDefaults(config: Configuration, defaults: Partial<Configuration>): Configuration {
      return config;
    },

    validate(config: Configuration) { }
  };
}

interface Configuration {
  customerId: string;
  structure: Structure;

  collection?: string;
  area?: string;
  language?: string;
  visitorId?: string;
  sessionId?: string;

  query?: Partial<Request>;

  tags?: { [key: string]: any };

  services?: { [key: string]: Service.Constructor | any | false };

  bootstrap?: (app: StoreFront) => void;

  stylish?: boolean;
  initialSearch?: boolean;
  simpleAttach?: boolean;
  globalMixin?: boolean;
}

export default Configuration;

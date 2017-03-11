import { Request } from 'groupby-api';
import { Service, Structure } from '.';
import StoreFront from '../storefront';
import DEFAULTS from './defaults';

namespace Configuration {
  export namespace Transformer {
    export function transform(rawConfig: Configuration): Configuration {
      const config = Transformer.deprecationTransform(rawConfig);
      const finalConfig = Transformer.applyDefaults(config, DEFAULTS);

      Transformer.validate(finalConfig);

      return finalConfig;
    }

    /**
     * transform to handle graceful deprecation of configuration
     */
    export function deprecationTransform(config: Configuration): Configuration {
      return config;
    }

    export function applyDefaults(config: Configuration, defaults: Partial<Configuration>): Configuration {
      return config;
    }

    export function validate(config: Configuration) { }
  }
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

import { Request } from 'groupby-api';
import StoreFront from '../storefront';

export interface Configuration {
  customerId: string;
  structure: Structure;

  collection?: string;
  area?: string;
  language?: string;
  visitorId?: string;
  sessionId?: string;

  tags?: { [key: string]: any };

  services?: { [key: string]: { new (app: StoreFront): Service } | any | false };

  query?: Partial<Request>;

  stylish?: boolean;
  initialSearch?: boolean;
  simpleAttach?: boolean;
}

export namespace Structure {
  export interface Base {
    id: string;
    title: string;
    price: string;

    url?: string;
  }

  export interface Tranformable extends Base {
    _transform?: (metadata: any) => any;
  }

  export interface Variant {
    field: string;
    structure: Partial<Structure.Tranformable>;
  }
}

export interface Structure extends Structure.Tranformable {
  _variant?: Partial<Structure.Variant>;
}

export namespace Service {
  export interface Map { [key: string]: Service; }
  export interface ConstructorMap { [key: string]: { new (app: StoreFront): Service }; }
}

export interface Service {
  new (app: StoreFront): Service;
  init(services: Service.Map): void;
}

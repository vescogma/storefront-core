import * as TrackerClient from 'gb-tracker-client';
import { Events } from 'groupby-api';
import * as Cookies from 'js-cookie';
import * as uuid from 'uuid';
import { defaults, Service, Transformer } from '../core';
import StoreFront from '../storefront';

export const MAX_COOKIE_AGE = 365; // days
export const VISITOR_COOKIE_KEY = 'visitor';
export const SESSION_COOKIE_KEY = 'session';
export const EVENTS: Event[] = ['search', 'viewProduct'];
export type Event = 'search' | 'viewProduct';

export const DEFAULTS = {
  warnings: true,
  metadata: {}
};

namespace Tracker {
  export interface Configuration {
    warnings?: boolean;
    metadata?: {
      _search?: any;
      _viewProduct?: any;
    } & any;
  }
}

@defaults(DEFAULTS)
class Tracker extends Service<Tracker.Configuration> {

  tracker: typeof TrackerClient;
  transformer: Transformer;

  constructor(app: StoreFront) {
    super(app);
    this.tracker = new TrackerClient(app.config.customerId, app.config.area);
    this.transformer = new Transformer(app.config.structure);
  }

  init() {
    if (!this.config.warnings) {
      this.tracker.disableWarnings();
    }

    this.setVisitorInfo();
    this.listenForViewProduct();
  }

  /**
   * set visitorId and sessionId from the configuration
   * fallback to {@link VISITOR_COOKIE_KEY} and {@link SESSION_COOKIE_KEY} cookies
   * generates unique IDs if none found
   */
  setVisitorInfo() {
    const visitorId = this.app.config.visitorId
      || Cookies.get(VISITOR_COOKIE_KEY)
      || uuid.genV1().hexString;
    const sessionId = this.app.config.sessionId
      || Cookies.get(SESSION_COOKIE_KEY)
      || uuid.genV1().hexString;

    this.setVisitor(visitorId, sessionId);
  }

  /**
   * attach details page listener for 'viewProduct' event
   */
  listenForViewProduct() {
    this.app.flux.on(Events.DETAILS, ({ allMeta }) => {
      const product = Transformer.remap(allMeta, this.transformer.structure);
      this.tracker.sendViewProductEvent({
        metadata: this.generateMetadata('viewProduct'),
        product: {
          productId: product.id,
          title: product.title,
          price: product.price,
          category: 'NONE'
        }
      });
    });
  }

  /**
   * set {@link VISITOR_COOKIE_KEY} and {@link SESSION_COOKIE_KEY} cookies
   */
  setVisitor(visitorId: string, sessionId: string) {
    this.tracker.setVisitor(visitorId, sessionId);

    Cookies.set(VISITOR_COOKIE_KEY, visitorId, { expires: MAX_COOKIE_AGE });
    Cookies.set(SESSION_COOKIE_KEY, sessionId);
  }

  search() {
    this.sendSearchEvent();
  }

  didYouMean() {
    this.sendSearchEvent('dym');
  }

  sayt() {
    this.sendSearchEvent('sayt');
  }

  addToCart(productsInfo: any) {
    this.tracker.sendAddToCartEvent(productsInfo);
  }

  order(productsInfo: any) {
    this.tracker.sendOrderEvent(productsInfo);
  }

  /**
   * create event-specific metadata from configuration
   */
  generateMetadata(type?: Event) {
    const {[`_${type}`]: typeMeta = {}, ...meta } = this.config.metadata;
    const metadata = { ...meta, ...typeMeta, ...this.generateEventMask() };

    return Object.entries(metadata)
      .map(([key, value]) => ({ key, value }));
  }

  /**
   * mask event-specific metadata configuration
   */
  generateEventMask() {
    return EVENTS.reduce<{ [key: string]: undefined }>((mask, key) =>
      Object.assign(mask, { [`_${key}`]: undefined }), {});
  }

  sendSearchEvent(origin: string = 'search') {
    const convertedRecords = this.app.flux.results.records.map((record) => {
      const { id: _id, url: _u, title: _t, ...meta } = record;
      return { _id, _u, _t, ...meta };
    });

    this.tracker.sendSearchEvent({
      metadata: this.generateMetadata('search'),
      search: {
        origin: { [origin]: true },
        query: this.app.flux.results.originalQuery || '',
        ...this.app.flux.results,
        ...{ records: convertedRecords }
      }
    });
  }
}

export default Tracker;

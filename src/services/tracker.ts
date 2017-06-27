import { Actions, Events } from '@storefront/flux-capacitor';
import ProductTransformer from '../core/product-transformer';
import { core, BaseService } from '../core/service';
import { GbTracker } from '../core/utils';
import StoreFront from '../storefront';

export const TRACKER_EVENT = 'tracker:send_event';

class TrackerService extends BaseService<TrackerService.Options> {

  client: GbTracker = new GbTracker(this.app.config.customerId, this.app.config.area);
  transform: (product: any) => any = ProductTransformer.transformer(this.app.config.structure);

  constructor(app: StoreFront, opts: TrackerService.Options) {
    super(app, opts);
    app.flux.on(Events.BEACON_SEARCH, this.sendSearchEvent);
    app.flux.on(Events.BEACON_VIEW_CART, this.sendViewCartEvent);
    app.flux.on(Events.BEACON_ADD_TO_CART, this.sendAddToCartEvent);
    app.flux.on(Events.BEACON_REMOVE_FROM_CART, this.sendRemoveFromCartEvent);
    app.flux.on(Events.BEACON_ORDER, this.sendOrderEvent);
    app.flux.on(Events.BEACON_VIEW_PRODUCT, this.sendViewProductEvent);
  }

  init() {
    if (!this.opts.warnings) {
      this.client.disableWarnings();
    }

    this.client.autoSetVisitor(this.app.config.visitorId);
  }

  sendEvent(method: keyof GbTracker, event: any) {
    this.app.flux.emit(TRACKER_EVENT, { type: method, event });
    (<any>this.client[method])(event);
  }

  sendSearchEvent = (id: string) => {
    const origin = this.getSearchOrigin();
    this.sendEvent('sendAutoSearchEvent', {
      search: {
        id,
        origin: { [origin.origin || 'search']: true },
      },
      metadata: this.getMetadata(origin)
    });
  }
  sendViewCartEvent = (event: GbTracker.CartEvent) =>
    this.sendEvent('sendViewCartEvent', this.addMetadata(event))
  sendAddToCartEvent = (event: GbTracker.CartEvent) =>
    this.sendEvent('sendAddToCartEvent', this.addMetadata(event))
  sendRemoveFromCartEvent = (event: GbTracker.CartEvent) =>
    this.sendEvent('sendRemoveFromCartEvent', this.addMetadata(event))
  sendOrderEvent = (event: GbTracker.OrderEvent) =>
    this.sendEvent('sendOrderEvent', this.addMetadata(event))
  sendViewProductEvent = (record: any) => {
    const { id: productId, title, price } = this.transform(record.allMeta);
    this.sendEvent('sendViewProductEvent', this.addMetadata({
      product: {
        productId,
        title,
        price,
        collection: record.collection
      }
    }));
  }

  addMetadata(event: any) {
    return {
      ...event,
      metadata: [...event.metadata, ...this.getMetadata()]
    };
  }

  getSearchOrigin() {
    return this.app.flux.store.getState().session.origin;
  }

  getMetadata(origin: Actions.Metadata.Tag = this.getSearchOrigin()) {
    return origin ? [
      { key: 'tagName', value: origin.name },
      { key: 'tagId', value: String(origin.id) },
    ] : [];
  }
}

namespace TrackerService {
  export interface Options {
    warnings?: boolean;
  }
}

export default TrackerService;
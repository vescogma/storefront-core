import * as core from '../src/core';
import StoreFront from '../src/storefront';
import { expect, sinon } from './_suite';

describe('StoreFront', () => {
  let system: sinon.SinonStub;
  let bootstrap: sinon.SinonSpy;
  let initServices: sinon.SinonSpy;
  let initMixin: sinon.SinonSpy;

  beforeEach(() => {
    bootstrap = sinon.spy();
    initServices = sinon.spy();
    initMixin = sinon.spy();
    system = sinon.stub(core, 'System', () => ({ bootstrap, initServices, initMixin }));
  });
  afterEach(() => {
    sinon.restore();
    if (StoreFront._instance) {
      delete StoreFront._instance;
    }
  });

  describe('constructor()', () => {
    it('should be a singleton', () => {
      const storefront = new StoreFront(<any>{});

      expect(storefront).to.be.ok;
      expect(StoreFront._instance).to.eq(storefront);
      expect(new StoreFront(<any>{})).to.eq(storefront);
    });

    it('should set config', () => {
      const config: any = {};

      expect(new StoreFront(config).config).to.eq(config);
    });

    it('should intialize system', () => {
      const app = new StoreFront(<any>{});

      expect(system.calledWith(app)).to.be.true;
    });

    it('should bootstrap system', () => {
      new StoreFront(<any>{}); // tslint:disable-line:no-unused-new

      expect(bootstrap.called).to.be.true;
    });

    it('should intialize services', () => {
      new StoreFront(<any>{}); // tslint:disable-line:no-unused-new

      expect(initServices.called).to.be.true;
    });

    it('should intialize base riot mixin', () => {
      new StoreFront(<any>{}); // tslint:disable-line:no-unused-new

      expect(initMixin.called).to.be.true;
    });
  });
});

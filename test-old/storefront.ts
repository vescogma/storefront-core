import * as core from '../src/core';
import StoreFront from '../src/storefront';
import { expect, sinon } from './_suite';

describe('StoreFront', () => {
  let system: sinon.SinonStub;
  let initServices: sinon.SinonSpy;
  let initMixin: sinon.SinonSpy;

  beforeEach(() => {
    initServices = sinon.spy();
    initMixin = sinon.spy();
    system = sinon.stub(core, 'System', () => ({ initServices, initMixin }));
  });
  afterEach(() => {
    sinon.restore();
    if (StoreFront._instance) {
      delete StoreFront._instance;
    }
  });

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
});

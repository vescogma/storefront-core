import { expect } from 'chai';
import * as sinon from 'sinon';
import * as core from '../src/core';
import StoreFront from '../src/storefront';

describe('StoreFront', () => {
  let sb: sinon.SinonSandbox;

  beforeEach(() => sb = sinon.sandbox.create());
  afterEach(() => sb.restore());

  it('should be a singleton', () => {
    sb.stub(core, 'System', () => ({
      initServices: () => null,
      initMixin: () => null
    }));

    const storefront = new StoreFront(<any>{});

    expect(storefront).to.be.ok;
    expect(StoreFront._instance).to.eq(storefront);
    expect(new StoreFront(<any>{})).to.eq(storefront);
  });
});

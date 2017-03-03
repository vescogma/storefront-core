import * as core from '../../src/core';
import Tracker, { DEFAULTS } from '../../src/services/tracker';
import { expect, sinon } from '../_suite';

describe('Tracker Service', () => {
  beforeEach(() => sinon.stub(core, 'Transformer'));
  afterEach(() => sinon.restore());

  it('should set defaults', () => {
    const app: any = {
      registry: { register: () => null },
      config: { customerId: 'mycustomer' }
    };

    expect(new Tracker(app).config).to.eql(DEFAULTS);
  });
});

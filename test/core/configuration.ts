import { Configuration } from '../../src/core';
import DEFAULTS from '../../src/core/defaults';
import { expect, sinon } from '../_suite';

const Transformer = Configuration.Transformer;

describe('Configuration', () => {
  describe('Transformer', () => {
    afterEach(() => sinon.restore());

    describe('transform()', () => {
      it('should transform the raw configuration', () => {
        const config: any = {};
        const deprecationTransform = sinon.stub(Transformer, 'deprecationTransform');
        sinon.stub(Transformer, 'applyDefaults');
        sinon.stub(Transformer, 'validate');

        Transformer.transform(config);

        expect(deprecationTransform.calledWith(config)).to.be.true;
      });

      it('should apply default configuration', () => {
        const config = {};
        const applyDefaults = sinon.stub(Transformer, 'applyDefaults');
        sinon.stub(Transformer, 'deprecationTransform').returns(config);
        sinon.stub(Transformer, 'validate');

        Transformer.transform(<any>{});

        expect(applyDefaults.calledWith(config, DEFAULTS)).to.be.true;
      });

      it('should validate the final configuration', () => {
        const config: any = {};
        const validate = sinon.stub(Transformer, 'validate');
        sinon.stub(Transformer, 'deprecationTransform');
        sinon.stub(Transformer, 'applyDefaults').returns(config);

        const finalConfig = Transformer.transform(<any>{});

        expect(finalConfig).to.eq(config);
        expect(validate.calledWith(config)).to.be.true;
      });
    });

    describe('deprecationTransform()', () => {
      it('should return input', () => {
        const config: any = {};

        expect(Transformer.deprecationTransform(config)).to.eq(config);
      });
    });

    describe('applyDefaults', () => {
      it('should return input', () => {
        const config: any = {};

        expect(Transformer.applyDefaults(config, {})).to.eq(config);
      });
    });

    describe('validate()', () => {
      it('should not throw an error', () => {
        expect(() => Transformer.validate(<any>{})).to.not.throw();
      });
    });
  });
});

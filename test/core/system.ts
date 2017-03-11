import * as riot from 'riot';
import { System } from '../../src/core';
import { core } from '../../src/core/system';
import { expect, sinon } from '../_suite';

describe('System', () => {
  afterEach(() => sinon.restore());

  describe('constructor()', () => {
    it('should set app', () => {
      const app: any = {};
      const system = new System(app);

      expect(system.app).to.eq(app);
    });
  });

  describe('bootstrap()', () => {
    it('should set config', () => {
      const app: any = {};
      const config: any = {};
      const system = new System(app);

      system.bootstrap({}, config);

      expect(app.config).to.eq(config);
    });

    it('should build services', () => {
      const app: any = {};
      const services = {};
      const builtServices = {};
      const system = new System(app);
      const extractUserServices = sinon.stub(System, 'extractUserServices');
      const buildServices = sinon.stub(System, 'buildServices').returns(builtServices);

      system.bootstrap(services, <any>{});

      expect(app.services).to.eq(builtServices);
      expect(extractUserServices.calledWith({})).to.be.true;
      expect(buildServices.calledWith(app, services, {})).to.be.true;
    });

    it('should allow overriding services', () => {
      const app: any = {};
      const services: any = { a: 'b', c: 'd' };
      const servicesConfig = { c: 'd1', e: 'f' };
      const system = new System(app);
      const extractUserServices = sinon.stub(System, 'extractUserServices').returns(servicesConfig);
      const buildServices = sinon.stub(System, 'buildServices');

      system.bootstrap(services, <any>{ services: servicesConfig });

      expect(extractUserServices.calledWith(servicesConfig)).to.be.true;
      expect(buildServices.calledWith(app, { a: 'b', c: 'd1', e: 'f' }, servicesConfig)).to.be.true;
    });

    it('should allow user-defined services', () => {
      const service = {};
      const mockService = sinon.spy(() => service);
      const app: any = {};
      const system = new System(app);
      class MockService { }

      system.bootstrap({}, <any>{ services: { mockService } });

      expect(app.services.mockService).to.eq(service);
      expect(mockService.calledWith(app, {})).to.be.true;
    });

    it('should call user bootstrap function it provided', () => {
      const bootstrap = sinon.spy();
      const app: any = {};
      const system = new System(app);

      system.bootstrap({}, <any>{ bootstrap });

      expect(bootstrap.calledWith(app)).to.be.true;
    });
  });

  describe('initServices()', () => {
    it('should call init() on each service', () => {
      const init1 = sinon.spy();
      const init2 = sinon.spy();
      const services = { s1: { init: init1 }, s2: { init: init2 } };
      const system = new System(<any>{ services });

      system.initServices();

      expect(init1.calledWith(services)).to.be.true;
      expect(init2.calledWith(services)).to.be.true;
    });
  });

  describe('initMixin()', () => {
    it('should setup global mixin', () => {
      const services = { a: 'b' };
      const system = new System(<any>{ services, config: { globalMixin: true } });
      const mixin = sinon.stub(riot, 'mixin');

      system.initMixin();

      expect(mixin.calledWith({ services })).to.be.true;
    });

    it('should setup storefront mixin', () => {
      const services = { a: 'b' };
      const system = new System(<any>{ services, config: {} });
      const mixin = sinon.stub(riot, 'mixin');

      system.initMixin();

      expect(mixin.calledWith('storefront', { services })).to.be.true;
      expect(mixin.calledWith('sf', { services })).to.be.true;
    });
  });

  describe('static', () => {
    describe('buildServices()', () => {
      it('should construct services', () => {
        const app: any = {};
        const constructor = sinon.spy();
        class MockService {
          constructor(...args: any[]) { constructor(...args); }
        }

        const services = System.buildServices(app, <any>{ mockService: MockService }, {});

        expect(services['mockService']).to.be.an.instanceof(MockService);
        expect(constructor.calledWith(app, {})).to.be.true;
      });

      it('should remove disabled services', () => {
        const app: any = {};
        const constructor = sinon.spy();
        class MockService { constructor(...args: any[]) { constructor(...args); } }

        const services = System.buildServices(app, <any>{ mockService: MockService }, { mockService: false });

        expect(services).to.eql({});
        expect(constructor.called).to.be.false;
      });

      it('should not disable core services', () => {
        const app: any = {};
        @core
        class MockService { }

        const services = System.buildServices(app, <any>{ mockService: MockService }, { mockService: false });

        expect(services['mockService']).to.be.an.instanceof(MockService);
      });

      it('should allow configuration of services', () => {
        const mockService = { a: 'b' };
        const constructor = sinon.spy();
        const app: any = {};
        class MockService { constructor(...args: any[]) { constructor(...args); } }

        System.buildServices(app, <any>{ mockService: MockService }, { mockService });

        expect(constructor.calledWith(app, mockService)).to.be.true;
      });
    });

    describe('extractUserServices()', () => {
      it('should extract functions', () => {
        const userService = () => null;
        const services = { a: 'b', c: 4, e: true, userService };

        const userServices = System.extractUserServices(services);

        expect(userServices).to.eql({ userService });
      });
    });
  });
});

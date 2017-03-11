import { System } from '../../src/core';
import { core } from '../../src/core/system';
import { expect, sinon } from '../_suite';

describe('System', () => {

  describe('constructor()', () => {
    it('should set app', () => {
      const app: any = {};
      const system = new System(app);

      expect(system.app).to.eq(app);
    });
  });

  describe('bootstrap()', () => {
    it('should construct services', () => {
      const app: any = { config: {} };
      const system = new System(app);
      const constructor = sinon.spy();
      class MockService {
        constructor(...args: any[]) { constructor(...args); }
      }

      system.bootstrap(<any>{ mockService: MockService });

      expect(app.services.mockService).to.be.an.instanceof(MockService);
      expect(constructor.calledWith(app, {})).to.be.true;
    });

    it('should remove disabled services', () => {
      const app: any = { config: { services: { mockService: false } } };
      const system = new System(app);
      const constructor = sinon.spy();
      class MockService { constructor(...args: any[]) { constructor(...args); } }

      system.bootstrap(<any>{ mockService: MockService });

      expect(app.services).to.eql({});
      expect(constructor.called).to.be.false;
    });

    it('should not disable core services', () => {
      const app: any = { config: { services: { mockService: false } } };
      const system = new System(app);
      @core
      class MockService { }

      system.bootstrap(<any>{ mockService: MockService });

      expect(app.services.mockService).to.be.an.instanceof(MockService);
    });

    it('should allow overriding services', () => {
      const service = {};
      const mockService = sinon.spy(() => service);
      const app: any = { config: { services: { mockService } } };
      const system = new System(app);
      class MockService { }

      system.bootstrap(<any>{ mockService: MockService });

      expect(app.services.mockService).to.eq(service);
      expect(mockService.calledWith(app, {})).to.be.true;
    });

    it('should allow user-defined services', () => {
      const service = {};
      const mockService = sinon.spy(() => service);
      const app: any = { config: { services: { mockService } } };
      const system = new System(app);
      class MockService { }

      system.bootstrap({});

      expect(app.services.mockService).to.eq(service);
      expect(mockService.calledWith(app, {})).to.be.true;
    });

    it('should allow configuration of services', () => {
      const mockService = { a: 'b' };
      const constructor = sinon.spy();
      const app: any = { config: { services: { mockService } } };
      const system = new System(app);
      class MockService { constructor(...args: any[]) { constructor(...args); } }

      system.bootstrap(<any>{ mockService: MockService });

      expect(constructor.calledWith(app, mockService)).to.be.true;
    });

    it('should call user bootstrap function it provided', () => {
      const bootstrap = sinon.spy();
      const app: any = { config: { bootstrap } };
      const system = new System(app);

      system.bootstrap({});

      expect(bootstrap.calledWith(app)).to.be.true;
    });
  });
});

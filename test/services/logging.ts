import * as log from 'loglevel';
import Logging from '../../src/services/logging';
import { expect } from '../_suite';

describe('Logging', () => {

  describe('init()', () => {
    it('should set log', () => {
      const app: any = {};

      new Logging(app).init({});

      expect(app.log).to.eq(log);
    });
  });
});

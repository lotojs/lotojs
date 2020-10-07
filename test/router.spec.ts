import { UtilRouter } from "../lib/router";

describe('Util Router', () => {

  describe('isRoute', () => {

    test(`When the function is not a 'route', return false`, () => {
      const obj = jest.fn();
      const result = UtilRouter.isRoute(obj);
      expect(result).toBe(false);
    });

    test(`When the function is a 'route', return true`, () => {
      const obj = jest.fn();
      obj.prototype.metadata = {
        type: 'route'
      }
      const result = UtilRouter.isRoute(obj);
      expect(result).toBe(true);
    });

  });

  describe('normalizePath', () => {

    test(`When entering a 'path', return the same normalized`, () => {
      const prefix = "/INDEX////"
      const path = "///:id///"
      const normalize = '/index/:id'
      const result = UtilRouter.normalizePath(
        prefix,
        path
      );
      expect(result).toBe(normalize);
    });

  });

})
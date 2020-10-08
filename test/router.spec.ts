import * as EscapeStringReg from 'escape-string-regexp';
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

    test(`When entering a 'prefix' and 'path' in string format, return the same normalized`, () => {
      const prefix = "/INDEX////"
      const path = "///:id///"
      const normalize = '/index/:id'
      const result = UtilRouter.normalizePath(
        prefix,
        path
      );
      expect(typeof result).toBe('string');
      expect(result).toBe(normalize);
    });

    test(`When entering a 'prefix' in regex format, return concat regex`, () => {
      const prefix = /index/;
      const path = "///:id///"
      const normalize = new RegExp(
        prefix.source + EscapeStringReg('/:id')
      );
      const result = UtilRouter.normalizePath(
        prefix,
        path
      );
      expect(result instanceof RegExp).toBe(true);
      expect((result as RegExp).source).toBe(normalize.source);
    });

    test(`When entering a 'path' in regex format, return concat regex`, () => {
      const prefix = '/index';
      const path = /\/:id/;
      const normalize = new RegExp(
        EscapeStringReg(prefix) + path.source
      );
      const result = UtilRouter.normalizePath(
        prefix,
        path
      );
      expect(result instanceof RegExp).toBe(true);
      expect((result as RegExp).source).toBe(normalize.source);
    });

  });

  describe('normalizeMethods', () => {

    test(`When entering a array of methods, return all in lowercase`, () => {
      const methods = [
        'GET',
        'POST',
        'DELETE',
        'PATCH',
        'PUT'
      ];
      const result = UtilRouter.normalizeMethods(
        methods
      );
      result.forEach((value) => {
        const toLower = value.toLowerCase();
        expect(value).toBe(toLower);
      });
    });

    test(`When entering a array of methods, return all without duplication`, () => {
      const methods = [
        'GET',
        'POST',
        'DELETE',
        'PATCH',
        'PUT',
        'POST',
        'PUT',
        'GET'
      ];
      const result = UtilRouter.normalizeMethods(
        methods
      );
      result.forEach((value, index) => {
        const indexFrom = result.indexOf(value);
        expect(index).toBe(indexFrom);
      });
    });

  });

})
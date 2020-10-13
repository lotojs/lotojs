import * as EscapeStringReg from 'escape-string-regexp';
import { Get, Hook, Input, Output } from '../lib/controller';
import { RouteRequest, UtilRouter } from "../lib/router";

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

  describe('isHook', () => {

    test(`When the function is not a 'hook', return false`, () => {
      const fn = jest.fn();
      const result = UtilRouter.isHook(fn);
      expect(result).toBe(false);
    });

    test(`When the function is a 'hook', return true`, () => {
      const fn = jest.fn();
      const setHook = Hook();
      setHook(undefined, undefined, fn);
      const result = UtilRouter.isHook(fn);
      expect(result).toBe(true);
    });

  });

})


describe('Route Request', () => {

  describe('initContext', () => {

    test(`When the 'initContext' function is called, initialize the context values`, async () => {
      const controller = jest.fn();
      const route = jest.fn();
      const setGet = Get();
      setGet(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.context).toHaveProperty('id', route.prototype.metadata.id);
      expect(instance.context).toHaveProperty('input', null);
      expect(instance.context).toHaveProperty('next', false);
      expect(instance.context).toHaveProperty('save', {});
      expect(instance.context).toHaveProperty('params', null);
    });

  });

  describe('executeInputs', () => {

    test(`When a route is executed without 'inputs', it does not execute the loop`, async () => {
      const controller = jest.fn();
      const route = jest.fn();
      const setGet = Get();
      setGet(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.req).toStrictEqual({});
    });

    test(`When a route is executed with simple 'inputs', the loop is executed`, async () => {
      const controller = jest.fn();
      const route = jest.fn();
      const setGet = Get();
      setGet(undefined, undefined, route);
      const middleware = (req, res, next, context) => {
        req.check = true;
      }
      const setInput = Input(middleware);
      setInput(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.req).toStrictEqual({
        check: true
      });
    });

  });

  describe('executeOutputs', () => {

    test(`When a route is executed without 'outputs', it does not execute the loop`, async () => {
      const controller = jest.fn();
      const route = jest.fn();
      const setGet = Get();
      setGet(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.req).toStrictEqual({});
    });

    test(`When a route is executed simple 'outputs', the loop is executed`, async () => {
      const controller = jest.fn();
      const route = jest.fn();
      const setGet = Get();
      setGet(undefined, undefined, route);
      const middleware = (req, res, next, context) => {
        req.check = true;
      }
      const setInput = Output(middleware);
      setInput(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.req).toStrictEqual({
        check: true
      });
    });

  });

  describe('executeRoute', () => {

    test(`When a route is assigned, this is executed`, async () => {
      const controller = jest.fn();
      const route = (req, res) => {
        req.check = true;
      };
      const setGet = Get();
      setGet(undefined, undefined, route);
      const instance = new RouteRequest(
        {},
        {},
        controller,
        route
      );
      await instance.execute();
      expect(instance.req).toStrictEqual({
        check: true
      });
    });

  });

});
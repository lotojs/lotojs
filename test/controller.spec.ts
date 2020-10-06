import { Controller } from "../lib/controller";

describe('Controller', () => {

  test('When the @Controller is inserted, add metadata', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'controller');
  });

  test('When the @Controller path has value, set path', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.options.path', '/test');
  });

  test('When the @Controller path has not value, set path to null', () => {
    const obj = jest.fn();
    const controller = Controller();
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.options.path', null);
  });

})
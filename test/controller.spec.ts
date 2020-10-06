import { Controller } from "../lib/controller";

describe('Controller', () => {

  test('When the @Controller is inserted, add metadata', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'controller');
    expect(obj.prototype).toHaveProperty('metadata.options.path', '/test');
  });

})
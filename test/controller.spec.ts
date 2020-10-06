import { Controller } from "../lib/controller";

describe('Controller', () => {

  test('When I declare a controller, insert metadata', () => {
    const obj = {
      prototype: {}
    };
    const controller = Controller();
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata');
  });

})
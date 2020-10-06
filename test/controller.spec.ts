import { Controller } from "../lib/controller";

describe('Controller', () => {

  test('When the @Controller is inserted, add metadata', () => {
    const obj = jest.fn();
    const controller = Controller();
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
  });

})
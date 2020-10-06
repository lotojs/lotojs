import { Controller, Get, Patch, Delete, Put, Post, Input, Output } from "../lib/controller";

describe('@Controller', () => {

  test('When the @Controller is inserted, add metadata', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'controller');
  });

  test('When the @Controller path has value, set path', () => {
    const obj = jest.fn();
    const path = '/test';
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
  });

  test('When the @Controller path has not value, set path to null', () => {
    const obj = jest.fn();
    const controller = Controller();
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.route.path', null);
  });

})

describe('@Get', () => {

  test('When the @Get is inserted, add metadata', () => {
    const obj = jest.fn();
    const path = '/test';
    const execute = Get(path);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'route');
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
    expect(obj.prototype).toHaveProperty('metadata.route.method', ['GET']);
  });

})

describe('@Post', () => {

  test('When the @Post is inserted, add metadata', () => {
    const obj = jest.fn();
    const path = '/test';
    const execute = Post(path);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'route');
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
    expect(obj.prototype).toHaveProperty('metadata.route.method', ['POST']);
  });

})

describe('@Put', () => {

  test('When the @Put is inserted, add metadata', () => {
    const obj = jest.fn();
    const path = '/test';
    const execute = Put(path);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'route');
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
    expect(obj.prototype).toHaveProperty('metadata.route.method', ['PUT']);
  });

})

describe('@Patch', () => {

  test('When the @Patch is inserted, add metadata', () => {
    const obj = jest.fn();
    const path = '/test';
    const execute = Patch(path);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'route');
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
    expect(obj.prototype).toHaveProperty('metadata.route.method', ['PATCH']);
  });

})

describe('@Delete', () => {

  test('When the @Delete is inserted, add metadata', () => {
    const obj = jest.fn();
    const path = '/test';
    const execute = Delete(path);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'route');
    expect(obj.prototype).toHaveProperty('metadata.route.path', path);
    expect(obj.prototype).toHaveProperty('metadata.route.method', ['DELETE']);
  });

})

describe('@Input', () => {

  test('When the @Input is inserted, add metadata', () => {
    const obj = jest.fn();
    const firstMiddleware = jest.fn();
    const execute = Input(firstMiddleware);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.input', [{
      call: firstMiddleware
    }]);
  });

  test('When the @Input is inserted two times, concat input', () => {
    const obj = jest.fn();
    const firstMiddleware = jest.fn();
    const twoMiddleware = jest.fn();
    const firstExecute = Input(firstMiddleware);
    firstExecute(undefined, undefined, obj);
    const twoExecute = Input(twoMiddleware);
    twoExecute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.input', [
      {
        call: firstMiddleware
      },
      {
        call: twoMiddleware
      }
    ]);
  });

})

describe('@Output', () => {

  test('When the @Output is inserted, add metadata', () => {
    const obj = jest.fn();
    const execute = Output(obj);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.output', [{
      call: obj
    }]);
  });

  test('When the @Output is inserted two times, concat output', () => {
    const obj = jest.fn();
    const firstMiddleware = jest.fn();
    const twoMiddleware = jest.fn();
    const firstExecute = Output(firstMiddleware);
    firstExecute(undefined, undefined, obj);
    const twoExecute = Output(twoMiddleware);
    twoExecute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.output', [
      {
        call: firstMiddleware
      },
      {
        call: twoMiddleware
      }
    ]);
  });

})
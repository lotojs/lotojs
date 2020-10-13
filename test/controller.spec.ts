import { Controller, Get, Patch, Delete, Put, Post, Input, Output, Hook, Pipe, Save, Params, Obtain } from "../lib/controller";
import { ContextRoute } from "../lib/router";

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
    expect(obj.prototype).toHaveProperty('metadata.input', [firstMiddleware]);
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
      firstMiddleware,
      twoMiddleware
    ]);
  });

})

describe('@Output', () => {

  test('When the @Output is inserted, add metadata', () => {
    const obj = jest.fn();
    const execute = Output(obj);
    execute(undefined, undefined, obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.output', [obj]);
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
      firstMiddleware,
      twoMiddleware
    ]);
  });

})

describe('@Hook', () => {

  test('When the @Hook is inserted, add metadata', () => {
    const fn = jest.fn();
    const setHook = Hook();
    setHook(undefined, undefined, fn);
    expect(fn.prototype).toHaveProperty('metadata.id');
    expect(fn.prototype).toHaveProperty('metadata.type', 'hook');
    expect(fn.prototype).toHaveProperty('metadata.action');
  });

  test('When @Hook is inserted with action, add this in action metadata', () => {
    const fn = jest.fn();
    const setHook = Hook('save');
    setHook(undefined, undefined, fn);
    expect(fn.prototype).toHaveProperty('metadata.id');
    expect(fn.prototype).toHaveProperty('metadata.type', 'hook');
    expect(fn.prototype).toHaveProperty('metadata.action', 'save');
  });

})

describe('@Pipe', () => {

  test('When the @Hook is inserted with multiple functions, pass data between them', async () => {
    const req : any = {};
    const middleware1 = (req, res, next, context : ContextRoute) => {
      return 1;
    }
    const middleware2 = (req, res, next, context : ContextRoute) => {
      req.check = context.input + 1;
    }
    const setPipe = Pipe([
      middleware1,
      middleware2
    ]);
    await setPipe(req, {}, () => {}, {
      id: 'randomid',
      input: null,
      next: true,
      save: {},
      params: null
    });
    expect(req).toStrictEqual({
      check: 2
    });
  });

});

describe('@Save', () => {

  test('When @Save is inserted, return an object with the parameter key', async () => {
    const req : any = {};
    const middleware1 = (req, res, next, context : ContextRoute) => {
      return 1;
    }
    const setSave = Save(
      middleware1,
      'my-save'
    );
    const result = await setSave(req, {}, () => {}, {
      id: 'randomid',
      input: null,
      next: true,
      save: {},
      params: null
    });
    expect(result).toStrictEqual({
      'my-save': 1
    });
  });

});

describe('@Params', () => {

  test('When @Params is inserted, pass the params to the context', async () => {
    const req : any = {};
    const middleware1 = (req, res, next, context : ContextRoute) => {
      req.check = context.params;
    }
    const setParams = Params(
      middleware1,
      {
        'foo': 'bar'
      }
    );
    await setParams(req, {}, () => {}, {
      id: 'randomid',
      input: null,
      next: true,
      save: {},
      params: null
    });
    expect(req).toStrictEqual({
      check: {
        foo: 'bar'
      }
    });
  });

});

describe('@Obtain', () => {

  test('When @Obtain is inserted, return object with the key selected', async () => {
    const req : any = {};
    const setObtain = Obtain('my-save');
    const result = await setObtain(req, {}, () => {}, {
      id: 'randomid',
      input: null,
      next: true,
      save: {
        'my-save': 1
      },
      params: null
    });
    expect(result).toBe(1);
  });

});
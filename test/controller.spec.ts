import { Container, Singleton } from "typescript-ioc";
import { Controller, Get, Patch, Delete, Put, Post, Input, Output, Hook, Pipe, Save, Params, Response, Obtain, Request, Body, Header, Parameters, In, ContextSave } from "../lib/controller";
import { ContextRoute } from "../lib/router";

describe('@Controller', () => {

  test('When the @Controller is inserted, add metadata', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    expect(obj.prototype).toHaveProperty('metadata.id');
    expect(obj.prototype).toHaveProperty('metadata.type', 'controller');
  });

  test('When the @Controller is inserted, add to container', () => {
    const obj = jest.fn();
    const controller = Controller('/test');
    controller(obj);
    const container = Container.get(obj);
    expect(container).not.toBeNull();
  });

  test(`When the @Controller is inserted, set it with the 'singleton' pattern`, () => {
    const obj = function Test(){
      this.value = 1;
    }
    const controller = Controller('/test');
    controller(obj);
    for(let i = 1; i <= 10; i++){
      const container = Container.get(obj);
      expect(container.value).toBe(i);
      container.value++;
    }
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
      params: null,
      exception: null
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
      params: null,
      exception: null
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
      params: null,
      exception: null
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
      params: null,
      exception: null
    });
    expect(result).toBe(1);
  });

});


describe('@Request', () => {

  test('When @Request is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useRequest = Request();
    useRequest(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'request',
        param: undefined
      }
    });
  });

});

describe('@Response', () => {

  test('When @Response is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useResponse = Response();
    useResponse(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'response',
        param: undefined
      }
    });
  });

});

describe('@Body', () => {

  test('When @Body is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useBody = Body();
    useBody(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'body',
        param: undefined
      }
    });
  });

});

describe('@Header', () => {

  test('When @Header is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useHeader = Header();
    useHeader(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'header',
        param: undefined
      }
    });
  });

});

describe('@Parameters', () => {

  test('When @Parameters is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useParameters = Parameters();
    useParameters(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'parameters',
        param: undefined
      }
    });
  });

});

describe('@In', () => {

  test('When @In is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useIn = In();
    useIn(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'context',
        param: undefined
      }
    });
  });

});

describe('@ContextSave', () => {

  test('When @In is inserted, insert found parameters in metadata', async () => {
    const req : any = {};
    const fn = () => {}
    const useContextSave = ContextSave('bar');
    useContextSave(fn, 'myvar', 0);
    expect(fn.prototype).toHaveProperty('metadata.params');
    expect(fn.prototype.metadata.params).toStrictEqual({
      0: {
        type: 'contextsave',
        param: {
          key: 'bar'
        }
      }
    });
  });

});
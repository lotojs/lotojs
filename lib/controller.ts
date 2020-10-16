import "reflect-metadata";
import { nanoid } from 'nanoid';
import { Singleton } from 'typescript-ioc'
import { ContextRoute, RequestAction, ResponseAction } from './router';

export function Controller(path : string = null){
  return (target : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      target.prototype, 
      'metadata'
    );
    const id = nanoid();
    const type = 'controller';
    const setMetdata = {
      type,
      route: {
        path
      }
    };
    if(hasMetadata){
      target.prototype.metadata = {
        ...target.prototype.metadata,
        ...setMetdata
      }
      return;
    }
    target.prototype.metadata = {
      id,
      ...setMetdata
    };
    Singleton(target); // IOC
  }
}

function addMetadataRoute(
  target : any,
  options : any = {}
){
  const hasMetadata = Object.prototype.hasOwnProperty.call(
    target.prototype, 
    'metadata'
  );
  const id = nanoid();
  const path = options.path;
  const method = options.method;
  const type = 'route';
  const setMetdata = {
    type,
    route: {
      path,
      method: [method],
    }
  };
  if(hasMetadata){
    const hasMetadataType = Object.prototype.hasOwnProperty.call(
      target.prototype.metadata, 
      'type'
    );
    if(hasMetadataType && target.prototype.metadata.type === type){
      target.prototype.metadata = {
        ...target.prototype.metadata,
        ...{
          route: {
            ...target.prototype.metadata.route,
            method: [
              ...target.prototype.metadata.route.method,
              method
            ]
          }
        }
      }
      return;
    }
    target.prototype.metadata = {
      ...target.prototype.metadata,
      ...setMetdata
    }
    return;
  }
  target.prototype.metadata = {
    id,
    ...setMetdata
  };
}

/***************** */

export function Get(path? : string){
  return (target : any, name : string, fn : any) => {
    addMetadataRoute(
      (typeof fn === 'function') ? fn : fn.value,
      {
        path,
        method: 'GET'
      }
    );
  }
}

export function Post(path? : string){
  return (target : any, name : string, fn : any) => {
    addMetadataRoute(
      (typeof fn === 'function') ? fn : fn.value,
      {
        path,
        method: 'POST'
      }
    );
  }
}

export function Put(path? : string){
  return (target : any, name : string, fn : any) => {
    addMetadataRoute(
      (typeof fn === 'function') ? fn : fn.value,
      {
        path,
        method: 'PUT'
      }
    );
  }
}

export function Patch(path? : string){
  return (target : any, name : string, fn : any) => {
    addMetadataRoute(
      (typeof fn === 'function') ? fn : fn.value,
      {
        path,
        method: 'PATCH'
      }
    );
  }
}

export function Delete(path? : string){
  return (target : any, name : string, fn : any) => {
    addMetadataRoute(
      (typeof fn === 'function') ? fn : fn.value,
      {
        path,
        method: 'DELETE'
      }
    );
  }
}

/****************** */

function addMetadataParams(
  target: any,
  index: number,
  type: string
){
  const hasMetadata = Object.prototype.hasOwnProperty.call(
    target.prototype, 
    'metadata'
  );
  const id = nanoid();
  if(hasMetadata){
    const hasParams = Object.prototype.hasOwnProperty.call(
      target.prototype.metadata, 
      'params'
    );
    if(hasParams){
      target.prototype.metadata = {
        ...target.prototype.metadata,
        ...{
          params: {
            ...target.prototype.metadata.params,
            [index]: type
          }
        }
      }
      return;
    }
    target.prototype.metadata = {
      ...target.prototype.metadata,
      params: {
        [index]: type
      }
    }
    return;
  }
  target.prototype.metadata = {
    id,
    params: {
      [index]: type
    }
  };
}

export function Request(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'request'
    );
  }
}

export function Response(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'response'
    );
  }
}

export function Body(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'body'
    );
  }
}

export function Header(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'header'
    );
  }
}

export function Parameters(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'parameters'
    );
  }
}

export function Query(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'query'
    );
  }
}

export function In(){
  return (target : any, name : string, index : number) => {
    addMetadataParams(
      target[name],
      index,
      'context'
    );
  }
}

/***************** */

export function Input(call : any){
  return (target : any, name : string, fn : any) => {
    fn = (typeof fn === 'function') ? fn : fn.value;
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      fn.prototype, 
      'metadata'
    );
    const id = nanoid();
    if(hasMetadata){
      const hasInput = Object.prototype.hasOwnProperty.call(
        fn.prototype.metadata, 
        'input'
      );
      if(hasInput){
        if(!(fn.prototype.metadata.input instanceof Array)){
          throw new TypeError(`The 'input' key must be an 'Array'`);
        }
        fn.prototype.metadata = {
          ...fn.prototype.metadata,
          ...{
            input: [
              ...fn.prototype.metadata.input,
              call
            ]
          }
        }
        return;
      }
      fn.prototype.metadata = {
        ...fn.prototype.metadata,
        input: [
          call
        ]
      }
      return;
    }
    fn.prototype.metadata = {
      id,
      input: [
        call
      ]
    };
  }
}

export function Output(call : any){
  return (target : any, name : string, fn : any) => {
    fn = (typeof fn === 'function') ? fn : fn.value;
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      fn.prototype, 
      'metadata'
    );
    const id = nanoid();
    if(hasMetadata){
      const hasOutput = Object.prototype.hasOwnProperty.call(
        fn.prototype.metadata, 
        'output'
      );
      if(hasOutput){
        if(!(fn.prototype.metadata.output instanceof Array)){
          throw new TypeError(`The 'output' key must be an 'Array'`);
        }
        fn.prototype.metadata = {
          ...fn.prototype.metadata,
          ...{
            output: [
              ...fn.prototype.metadata.output,
              call
            ]
          }
        }
        return;
      }
      fn.prototype.metadata = {
        ...fn.prototype.metadata,
        output: [
          call
        ]
      }
      return;
    }
    fn.prototype.metadata = {
      id,
      output: [
        call
      ]
    };
  }
}

export function Interceptor(
  call : any
){
  return (target : any, name : string, fn : any) => {
    fn = (typeof fn === 'function') ? fn : fn.value;
		const hasMetadata = Object.prototype.hasOwnProperty.call(
      fn.prototype, 
      'metadata'
    );
    const id = nanoid();
    if(hasMetadata){
      fn.prototype.metadata = {
        ...fn.prototype.metadata,
        interceptor: call
      }
      return;
    }
    fn.prototype.metadata = {
      id,
      interceptor: call
    };
	}
}

/******************** */

export function Hook(action? : 'none' | 'save'){
  return (target : any, name : string, fn : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      fn.prototype, 
      'metadata'
    );
    const id = nanoid();
    const type = 'hook';
    if(hasMetadata){
      fn.prototype.metadata = {
        ...fn.prototype.metadata,
        type,
        action: action || 'none'
      }
      return;
    }
    fn.prototype.metadata = {
      id,
      type,
      action: action || 'none'
    };
  }
}

export function Pipe(
  fns : any[]
){
  const execute = async (req, res, next, context : ContextRoute) => {
    let result;
    for(const key in fns){
      const fnRef = fns[key];
      result = await fnRef(req, res, next, context);
      if(!context.next){
        return;
      }
      context.input = result;
    }
    return result;
  }
  const setHook = Hook();
  setHook(undefined, undefined, execute);
  return execute;
}

export function Save(
  fn : any,
  key : string
){
  const execute = async (req, res, next, context : ContextRoute) => {
    const result = await fn(req, res, next, context);
    if(!context.next){
      return;
    }
    return {
      [key]: result
    };
  };
  const setHook = Hook('save');
  setHook(undefined, undefined, execute);
  return execute;
}

export function Params(
  fn : any,
  params : any
){
  const execute = async (req, res, next, context : ContextRoute) => {
    context.params = params;
    const result = await fn(req, res, next, context);
    if(!context.next){
      return;
    }
    return result;
  };
  const setHook = Hook();
  setHook(undefined, undefined, execute);
  return execute;
}

export function Obtain(
  key : string,
){
  const execute = async (req, res, next, context : ContextRoute) => {
    next();
    return context.save[key];
  };
  const setHook = Hook();
  setHook(undefined, undefined, execute);
  return execute;
}

/********************* */

interface ActionInterface<T, U, Y> {
  Request : T,
  Response : U,
  Context: {
    obtain: Y
  }
}

export type Action<T = RequestAction, U = ResponseAction, Y = any> = ActionInterface<T, U, Y>

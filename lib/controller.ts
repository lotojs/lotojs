import { nanoid } from 'nanoid';

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
  }
}

function addMetadataRoute(target : any, options : any = {}){
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
      method: [method]
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

export function Get(path? : string){
  return (target : any) => {
    addMetadataRoute(
      target,
      {
        path,
        method: 'GET'
      }
    );
  }
}

export function Post(path? : string){
  return (target : any) => {
    addMetadataRoute(
      target,
      {
        path,
        method: 'POST'
      }
    );
  }
}

export function Put(path? : string){
  return (target : any) => {
    addMetadataRoute(
      target,
      {
        path,
        method: 'PUT'
      }
    );
  }
}

export function Patch(path? : string){
  return (target : any) => {
    addMetadataRoute(
      target,
      {
        path,
        method: 'PATCH'
      }
    );
  }
}

export function Delete(path? : string){
  return (target : any) => {
    addMetadataRoute(
      target,
      {
        path,
        method: 'DELETE'
      }
    );
  }
}

/***************** */

export function Pass(){
  return (target : any, name : string, fn : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      fn.prototype, 
      'metadata'
    );
  }
}
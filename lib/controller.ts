import { nanoid } from 'nanoid';

export function Controller(path : string = null){
  return (target : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      target.prototype, 
      'metadata'
    );
    const setMetdata = {
      id: nanoid(),
      type: 'controller',
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
    target.prototype.metadata = setMetdata;
  }
}

export function Get(path : string){
  return (target : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      target.prototype, 
      'metadata'
    );
    const setMetdata = {
      id: nanoid(),
      type: 'route',
      route: {
        path,
        method: 'GET'
      }
    };
    if(hasMetadata){
      target.prototype.metadata = {
        ...target.prototype.metadata,
        ...setMetdata
      }
      return;
    }
    target.prototype.metadata = setMetdata;
  }
}
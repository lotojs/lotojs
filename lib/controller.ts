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
    const id = nanoid();
    const method = 'GET';
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
}
import { nanoid } from 'nanoid';

export function Controller(){
  return (target : any) => {
    const hasMetadata = Object.prototype.hasOwnProperty.call(
      target.prototype, 
      'metadata'
    );
    const setMetdata = {
      id: nanoid(),
      type: 'controller'
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
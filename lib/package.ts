import { nanoid } from 'nanoid';

export interface PackageOptions{
  base?: string | RegExp,
  controllers? : any[],
  inputs? : ((...args : any[]) => any)[],
  outputs? : ((...args : any[]) => any)[],
  interceptor? : ((...args : any[]) => any)
}

export function Package(
  packageOptions : PackageOptions
){
  return (target : any) => {
    const id = nanoid();
    const type = 'package';
    target.prototype.metadata = {
      id,
      type,
      base: packageOptions.base,
      controllers: packageOptions.controllers || [],
      inputs: packageOptions.inputs || [],
      outputs: packageOptions.outputs || [],
      interceptor: packageOptions.interceptor
    }
  }
}
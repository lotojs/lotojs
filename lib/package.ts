import { nanoid } from 'nanoid';

export interface PackageOptions{
  base?: string | RegExp,
  controllers? : {new (...args : any[])}[],
  inputs? : ((...args : any[]) => any)[],
  outputs? : ((...args : any[]) => any)[],
  interceptor? : ((...args : any[]) => any),
  inherits?: (
    {
      package: {new (...args : any[])},
      includeInputs?: boolean,
      includeOutputs?: boolean,
      includeInterceptor?: boolean,
    }
    )[],
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
      base: packageOptions.base || '',
      controllers: packageOptions.controllers || [],
      inputs: packageOptions.inputs || [],
      outputs: packageOptions.outputs || [],
      interceptor: packageOptions.interceptor
    }
  }
}
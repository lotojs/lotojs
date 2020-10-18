import { nanoid } from 'nanoid';

interface PackageOptionsInheritsInterface{
  package: {new (...args : any[])},
  includeInputs?: boolean,
  includeOutputs?: boolean,
  includeInterceptor?: boolean,
}

export type PackageOptionsInherits = PackageOptionsInheritsInterface;

export interface PackageOptions{
  base?: string | RegExp,
  controllers? : {new (...args : any[])}[],
  inputs? : ((...args : any[]) => any)[],
  outputs? : ((...args : any[]) => any)[],
  interceptor? : ((...args : any[]) => any),
  inherits?: PackageOptionsInherits[],
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
      interceptor: packageOptions.interceptor,
      inherits: packageOptions.inherits,
    }
  }
}
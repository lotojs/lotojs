import * as Express from 'express';
import * as EscapeStringReg from 'escape-string-regexp';

export class Router{

  private _expressRef : any;

  public loadRoutes(packages : any[]){
    this._expressRef = Express();
    packages.forEach((value, index) => {
      const instance = new Route(
        this._expressRef
      );
      instance.setPackage(value);
      instance.load();
    });
  }

}

export class Route{

  private _package : any;

  private _id : string;
  private _path : string;

  constructor(
    private _expressRef : Express.Application
  ){}

  public load(){
    const controllers = this._package.prototype.controllers;
    for(const key in controllers){
      const controllerRef = controllers[key];
      for(const key in controllerRef.prototype){
        const routeRef = controllerRef.prototype[key];
        const isRoute = UtilRouter.isRoute(routeRef);
        if(!isRoute){
          continue;
        }
        const methods = UtilRouter.normalizeMethods(
          routeRef.prototype.metadata.route.method || []
        );
        methods.forEach((value) => {
          if(!(typeof this._expressRef[value] === 'function')){
            throw new Error(`Method '${value}' not valid`);
          }
          const path = UtilRouter.normalizePath(
            controllerRef.prototype.route.path,
            routeRef.prototype.metadata.route.path
          );
          this._expressRef[value](
            path,
            (req, res) => {
              this.request(
                req, 
                res,
                controllerRef,
                routeRef
              );
            }
          );
        });
      }
    }
  }

  private async request(req, res, controllerRef, routeRef){
    const context : Context = {
      id: routeRef.prototype.metadata.id,
      input: null,
      next: false
    };
    const next = () => {
      context.next = true;
    }
    const getInputs = routeRef.prototype.metadata.inputs || [];
    for(const key in getInputs){
      const inputRef = getInputs[key];
      if(typeof inputRef.call === 'function'){
        await inputRef(req, res, next, context);
      }
      if(!context.next){
        return;
      }
      context.next = false;
      context.input = null;
    }
  }

  public setPackage(packages : any){
    this._package = packages;
  }

  public get id(){
    return this._id;
  }

  public get path(){
    return this._path;
  }

}

export class UtilRouter{

  public static isRoute(fn : any){
    return Object.prototype.hasOwnProperty.call(
      fn,
      'prototype'
    ) && Object.prototype.hasOwnProperty.call(
      fn.prototype,
      'metadata'
    ) && Object.prototype.hasOwnProperty.call(
      fn.prototype.metadata,
      'type'
    ) && fn.prototype.metadata.type === 'route';
  }

  public static normalizePath(prefix : string | RegExp, path : string | RegExp){
    let normalizePrefix;
    let normalizePath;
    if(typeof prefix === 'string'){
      normalizePrefix = (prefix || '')
                              .replace(/\/{2,}/g, '/')
                              .replace(/\/+$/g, '')
                              .replace(/\s/g, '')
                              .toLowerCase()
                              .trim();
    }
    if(typeof path === 'string'){
      normalizePath = (path || '')
                              .replace(/\/{2,}/g, '/')
                              .replace(/^\/+/g, '')
                              .replace(/\/+$/g, '')
                              .replace(/\s/g, '')
                              .toLowerCase()
                              .trim();
    }
    if(
      typeof prefix === 'string' &&
      typeof path === 'string'
    ){
      return (normalizePrefix + `/${normalizePath}`)
                .replace(/\/+$/g, '');
    }
    return new RegExp(
      (
        (prefix instanceof RegExp) ? 
          prefix.source : 
          EscapeStringReg(
            normalizePrefix.replace(/\/+$/g, '')
          )
      ) 
      +
      (
        (path instanceof RegExp) ? 
          path.source : 
          EscapeStringReg(
            '/' + (normalizePath.replace(/\/+$/g, ''))
          )
      )
    );
  }

  public static normalizeMethods(methods : string[]){
    return methods.map((value) => {
      return value.toLowerCase();
    }).filter((value, index) => {
      const firstIndex = methods.indexOf(value);
      return index === firstIndex;
    });
  }

}

export interface Context{
  id: string,
  next: boolean,
  input: any
}
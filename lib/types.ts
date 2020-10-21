import * as Express from "express";

/********* Controller */

export interface ContextRoute {
  id: string;
  input: any;
  params: any;
  exception: any;
}

export type RequestAction = Express.Request;
export type ResponseAction = Express.Response;

export namespace Action{
  export type Request = RequestAction;
  export type Response = ResponseAction;
}

/********* Middleware */

export interface Middleware {
  middleware(
    req : RequestAction, 
    res : ResponseAction, 
    next : () => void, 
    context : ContextRoute
  ): any;
}

export enum MiddlewarePattern {
  Singleton,
  ByRequest
}

export interface ContextRouteLocalInterface {
  save: any;
  next: boolean;
}

export type ContextRouteLocal = ContextRouteLocalInterface;

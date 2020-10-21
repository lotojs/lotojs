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

interface ActionInterface<T, U, Y> {
  Request: T;
  Response: U;
  Context: {
    obtain: Y;
  };
}

export type Action<
  T = RequestAction,
  U = ResponseAction,
  Y = any
> = ActionInterface<T, U, Y>;

/********* Middleware */

export interface Middleware {
  middleware(req, res, next, context): any;
}

export enum MiddlewarePattern {
  Singleton,
}

export interface ContextRouteLocalInterface {
  save: any;
  next: boolean;
}

export type ContextRouteLocal = ContextRouteLocalInterface;

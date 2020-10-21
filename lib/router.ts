import * as Express from "express";
import * as EscapeStringReg from "escape-string-regexp";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { Container } from "typescript-ioc";
import { PackageOptionsInherits } from "./package";
import {
  ContextRoute,
  ContextRouteLocal,
  Middleware,
  MiddlewarePattern,
  RequestAction,
  ResponseAction,
} from "./types";

export class Router {
  private _expressRef: Express.Express = Express();

  public loadRoutes(packages: any[]) {
    packages.forEach((value, index) => {
      const instance = new Route(this._expressRef);
      instance.setPackage(value);
      instance.load();
    });
  }

  public get express() {
    return this._expressRef;
  }
}

export class Route {
  private _package: any;

  private _id: string;
  private _path: string;

  constructor(private _expressRef: Express.Application) {}

  public load() {
    const base = this._package.prototype.metadata.base;
    const controllers = this._package.prototype.metadata.controllers;
    const inputs = this._package.prototype.metadata.inputs;
    const outputs = this._package.prototype.metadata.outputs;
    const interceptor = this._package.prototype.metadata.interceptor;
    const inherits = this._package.prototype.metadata.inherits;
    for (const key in controllers) {
      const controllerRef = controllers[key];
      for (const key in controllerRef.prototype) {
        const routeRef = controllerRef.prototype[key];
        const isRoute = UtilRouter.isRoute(routeRef);
        if (!isRoute) {
          continue;
        }
        const methods = UtilRouter.normalizeMethods(
          routeRef.prototype.metadata.route.method || []
        );
        methods.forEach((value) => {
          if (!(typeof this._expressRef[value] === "function")) {
            throw new Error(`Method '${value}' not valid`);
          }
          const path = UtilRouter.normalizePath(
            UtilRouter.normalizeBaseInherits(inherits) + base,
            controllerRef.prototype.metadata.route.path,
            routeRef.prototype.metadata.route.path
          );
          const inputsRef = [
            ...UtilRouter.normalizeInputsInherits(inherits),
            ...(inputs || []),
            ...(routeRef.prototype.metadata.input || []),
          ];
          const outputsRef = [
            ...UtilRouter.normalizeOutputsInherits(inherits),
            ...(outputs || []),
            ...(routeRef.prototype.metadata.output || []),
          ];
          const interceptorRef =
            UtilRouter.normalizeInterceptorInherits(inherits) ||
            routeRef.prototype.metadata.interceptor ||
            interceptor;
          this._expressRef[value](path, (req, res) => {
            this.request(
              req,
              res,
              controllerRef,
              routeRef,
              inputsRef,
              outputsRef,
              interceptorRef
            );
          });
        });
      }
    }
  }

  private async request(
    req,
    res,
    controllerRef,
    routeRef,
    inputsRef,
    outputsRef,
    interceptorRef
  ) {
    const instance = new RouteRequest(
      req,
      res,
      controllerRef,
      routeRef,
      inputsRef,
      outputsRef,
      interceptorRef
    );
    await instance.execute();
  }

  public setPackage(packages: any) {
    this._package = packages;
  }

  public get id() {
    return this._id;
  }

  public get path() {
    return this._path;
  }
}

export class RouteRequest {
  private _context: ContextRoute;
  private _contextLocal: ContextRouteLocal;
  private _next: () => void;
  private _returnValue: any;

  constructor(
    private _req: RequestAction,
    private _res: ResponseAction,
    private _controller: any,
    private _route: any,
    private _inputs: any[],
    private _outputs: any[],
    private _interceptor: any
  ) {}

  public async execute() {
    this.initContext();
    this.initNext();
    try {
      await this.executeInputs();
      await this.executeRoute();
      await this.executeOutputs();
    } catch (e) {
      await this.executeInterceptor(e);
    }
  }

  private initContext() {
    this._context = {
      id: this.route.prototype.metadata.id,
      input: null,
      params: {},
      exception: null,
    };
    this._contextLocal = {
      save: {},
      next: false,
    };
  }

  private initNext() {
    this._next = () => {
      this.contextLocal.next = true;
    };
  }

  private async executeInputs() {
    const getInputs = this._inputs;
    this.context.input = this.req;
    for (const key in getInputs) {
      const inputRef = getInputs[key];
      await UtilRouter.recursiveContext(
        inputRef,
        this.req,
        this.res,
        this.next,
        this.context,
        this.contextLocal
      );
      if (!this.contextLocal.next) {
        return;
      }
      this.contextLocal.next = false;
    }
  }

  private async executeRoute() {
    const getParams = this.route.prototype.metadata.params || {};
    const paramsArray = [];
    for (const key in getParams) {
      let ref;
      const type = getParams[key].type;
      const param = getParams[key].param || {};
      switch (type) {
        case "request":
          ref = this.req;
          break;
        case "response":
          ref = this.res;
          break;
        case "body":
          ref = this.req.body;
          break;
        case "header":
          ref = this.req.headers;
          break;
        case "parameters":
          ref = this.req.params;
          break;
        case "query":
          ref = this.req.query;
          break;
        case "context":
          ref = {
            save: this.contextLocal.save,
          };
          break;
        case "contextsave":
          ref = this.contextLocal.save[param.key];
          break;
      }
      paramsArray.push(ref);
    }
    this._returnValue = await this.route.apply(
      Container.get(this.controller),
      paramsArray
    );
  }

  private async executeOutputs() {
    const getOutputs = this._outputs;
    this.context.input = this._returnValue;
    for (const key in getOutputs) {
      const inputRef = getOutputs[key];
      await UtilRouter.recursiveContext(
        inputRef,
        this.req,
        this.res,
        this.next,
        this.context,
        this.contextLocal
      );
      if (!this.contextLocal.next) {
        return;
      }
      this.contextLocal.next = false;
      this.context.input = this._returnValue;
    }
  }

  private async executeInterceptor(exception: any) {
    const getInterceptor = this._interceptor;
    if (!(typeof getInterceptor === "function")) {
      this.res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
    const interceptorRef = getInterceptor;
    await interceptorRef(this.req, this.res, exception);
  }

  public get req() {
    return this._req;
  }

  public get res() {
    return this._res;
  }

  public get controller() {
    return this._controller;
  }

  public get route() {
    return this._route;
  }

  public get next() {
    return this._next;
  }

  public get context() {
    return this._context;
  }

  public get contextLocal() {
    return this._contextLocal;
  }
}

export class UtilRouter {
  public static async recursiveContext(
    fn: any,
    req: any,
    res: any,
    next: any,
    context: any,
    contextLocal?: any
  ) {
    const inputRef = fn;
    if (inputRef.prototype.metadata?.middleware) {
      const pattern = inputRef.prototype.metadata.middleware.pattern;
      switch (pattern) {
        case MiddlewarePattern.Singleton:
          const middlewareRef = Container.get<Middleware>(inputRef);
          return await middlewareRef.middleware(req, res, next, context);
      }
    } else if (UtilRouter.isHook(inputRef)) {
      return await inputRef.apply(contextLocal, [req, res, next, context]);
    } else {
      return await inputRef(req, res, next, context);
    }
  }

  public static isRoute(fn: any) {
    return (
      typeof fn === "function" &&
      Object.prototype.hasOwnProperty.call(fn, "prototype") &&
      Object.prototype.hasOwnProperty.call(fn.prototype, "metadata") &&
      Object.prototype.hasOwnProperty.call(fn.prototype.metadata, "type") &&
      fn.prototype.metadata.type === "route"
    );
  }

  public static isHook(fn: any) {
    return (
      typeof fn === "function" &&
      Object.prototype.hasOwnProperty.call(fn, "prototype") &&
      Object.prototype.hasOwnProperty.call(fn.prototype, "metadata") &&
      Object.prototype.hasOwnProperty.call(fn.prototype.metadata, "type") &&
      fn.prototype.metadata.type === "hook"
    );
  }

  public static normalizePath(
    base: string | RegExp,
    prefix: string | RegExp,
    path: string | RegExp
  ) {
    let normalizeBase;
    let normalizePrefix;
    let normalizePath;
    base = base || "";
    prefix = prefix || "";
    path = path || "";
    if (typeof base === "string") {
      normalizeBase = (base || "")
        .replace(/\/{2,}/g, "/")
        .replace(/\/+$/g, "")
        .replace(/\s/g, "")
        .toLowerCase()
        .trim();
    }
    if (typeof prefix === "string") {
      normalizePrefix = (prefix || "")
        .replace(/\/{2,}/g, "/")
        .replace(/\/+$/g, "")
        .replace(/\s/g, "")
        .toLowerCase()
        .trim();
    }
    if (typeof path === "string") {
      normalizePath = (path || "")
        .replace(/\/{2,}/g, "/")
        .replace(/^\/+/g, "")
        .replace(/\/+$/g, "")
        .replace(/\s/g, "")
        .toLowerCase()
        .trim();
    }
    if (typeof prefix === "string" && typeof path === "string") {
      return (normalizeBase + normalizePrefix + `/${normalizePath}`).replace(
        /\/+$/g,
        ""
      );
    }
    return new RegExp(
      (base instanceof RegExp
        ? base.source
        : EscapeStringReg(normalizeBase.replace(/\/+$/g, ""))) +
        (prefix instanceof RegExp
          ? prefix.source
          : EscapeStringReg(normalizePrefix.replace(/\/+$/g, ""))) +
        (path instanceof RegExp
          ? path.source
          : EscapeStringReg("/" + normalizePath.replace(/\/+$/g, "")))
    );
  }

  public static normalizeMethods(methods: string[]) {
    return methods
      .filter((value, index) => {
        const firstIndex = methods.indexOf(value);
        return index === firstIndex;
      })
      .map((value) => {
        return value.toLowerCase();
      });
  }

  public static normalizeInputsInherits(inherits: PackageOptionsInherits[]) {
    const inheritsRef = inherits || [];
    const result = inheritsRef
      .filter((value, index) => {
        return (
          value.includeInputs === undefined || value.includeInputs === true
        );
      })
      .map((value) => {
        return value.package.prototype.metadata.inputs || [];
      });
    return [].concat(...result);
  }

  public static normalizeOutputsInherits(inherits: PackageOptionsInherits[]) {
    const inheritsRef = inherits || [];
    const result = inheritsRef
      .filter((value, index) => {
        return (
          value.includeOutputs === undefined || value.includeOutputs === true
        );
      })
      .map((value) => {
        return value.package.prototype.metadata.outputs || [];
      });
    return [].concat(...result);
  }

  public static normalizeBaseInherits(inherits: PackageOptionsInherits[]) {
    const inheritsRef = inherits || [];
    const result = inheritsRef
      .filter((value, index) => {
        return value.includeBase === true;
      })
      .map((value) => {
        return value.package.prototype.metadata.base || "";
      });
    if (result.length === 0) {
      return "";
    }
    return [""].concat(...result).reduce((acum: any, value: any) => {
      let normalizePrefix;
      if (typeof value === "string") {
        normalizePrefix = (value || "")
          .replace(/\/{2,}/g, "/")
          .replace(/\/+$/g, "")
          .replace(/\s/g, "")
          .toLowerCase()
          .trim();
      }
      if (typeof acum === "string" && typeof value === "string") {
        return (acum + normalizePrefix).replace(/\/+$/g, "");
      }
      if (typeof acum === "string" && value instanceof RegExp) {
        return new RegExp(EscapeStringReg(acum) + value.source);
      }
      if (acum instanceof RegExp && typeof value === "string") {
        return new RegExp(acum.source + EscapeStringReg(value));
      }
      if (acum instanceof RegExp && value instanceof RegExp) {
        return new RegExp(acum.source + value.source);
      }
      return acum;
    });
  }

  public static normalizeInterceptorInherits(
    inherits: PackageOptionsInherits[]
  ) {
    const inheritsRef = inherits || [];
    const result = inheritsRef.filter((value, index) => {
      return (
        value.includeBase === true &&
        value.package.prototype.metadata.interceptor
      );
    });
    return result[0]?.package?.prototype?.metadata?.interceptor;
  }
}

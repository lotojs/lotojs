import * as Http from "http";
import * as Https from "https";
import { Router } from "./router";

export abstract class App {
  public static init(
    packages: { new (...args: any[]) }[],
    options: AppLoadOptions = {}
  ) {
    return new AppLoader(
      packages,
      options
    );
  }
}

export interface AppLoaderOptionsInterface {}

export type AppLoadOptions = AppLoaderOptionsInterface;

export class AppLoader {
  private _router: Router;

  constructor(
    private _packages: { new (...args: any[]) }[],
    private _options: AppLoadOptions
  ) {
    this.setDefaultOptions();
    this._router = new Router();
    this._router.loadRoutes(
      this._packages
    );
  }

  private setDefaultOptions() {
    this._options = {
      ...{},
      ...this._options,
    };
  }

  public http(options?: {
    IncomingMessage?: any,
    ServerResponse?: any,
    insecureHTTPParser?: any,
    maxHeaderSize?: any,
  }){
    const server = Http.createServer(options);
    server.on('request', this._router.express);
    return server;
  }

  public https(options?: any){
    const server = Https.createServer(options);
    server.on('request', this._router.express);
    return server;
  }

  public get app() {
    return this._router.express;
  }
}

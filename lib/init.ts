import * as Http from 'http';
import * as Https from 'https';
import { Router } from "./router";

export abstract class App{

	public static init(
		options : AppLoadOptions = {}
	){
		return new AppLoader(
			options
		);
	}

}

export interface AppLoaderOptionsInterface{
	runServer?: boolean,
	http?: {
		port?: number,
		host?: string
	},
	https?: {
		port?: number,
		host?: string
	},
}

export type AppLoadOptions = AppLoaderOptionsInterface

class AppLoader{

	private _router : Router;
	private _serverHttp : any;
	private _serverHttps : any;

	constructor(
		private _options : AppLoadOptions
	){
		this.setDefaultOptions();
		this.setHttp();
		this.setHttps();
		this._router = new Router();
	}

	private setDefaultOptions(){
		this._options = {
			...{
				runServer: true,
				http: {
					port: 3000,
					host: '0.0.0.0'
				}
			},
			...this._options
		}
	}

	public async run(
		packages : any[]
	){
		this._router.loadRoutes(
			packages
		);
		this.runServer();
	}

	private setHttp(){
		if(!(this._options.runServer)){
			return;
		}
		if(!(this._options.http)){
			return;
		}
		this._serverHttp = Http.createServer();
	}

	private setHttps(){
		if(!(this._options.runServer)){
			return;
		}
		if(!(this._options.https)){
			return;
		}
		this._serverHttps = Https.createServer();
	}

	private runServer(){
		if(!(this._options.runServer)){
			return;
		}
		if(this._serverHttp){
			this._serverHttp.on('request', this._router.express);
			this._serverHttp.listen(
				this._options.http,
				() => {
					console.log("listening http")
				}
			);
		}
		if(this._serverHttps){
			this._serverHttps.on('request', this._router.express);
			this._serverHttps.listen(
				this._options.https,
				() => {
					console.log("listening https")
				}
			);
		}
	}

	public get server(){
		return {
			http: this._serverHttp,
			https: this._serverHttps
		};
	}

	public get express(){
		return this._router.express;
	}

}


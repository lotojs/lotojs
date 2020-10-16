import { Controller, Get } from "../lib/controller";
import { App, AppLoader } from "../lib/init";
import { Package } from "../lib/package";

describe('App', () => {

    test(`When 'init' is called, return an instance of 'AppLoader'`, () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        expect(instance instanceof AppLoader).toBe(true);
    });

    test(`When 'run' is called, load all packages`, async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        const controller = function(){}
        controller.prototype.test = function(){}
        const setGet = Get("/test");
        setGet(undefined, undefined, controller.prototype.test);
        const setController = Controller();
        setController(controller);
        const packages = () => {}
        const setPackage = Package({
            controllers: [
                controller
            ]
        });
        setPackage(packages);
        await instance.run([
            packages
        ]);
        // console.log(instance.express)
        // expect(instance instanceof AppLoader).toBe(true);
    });

});
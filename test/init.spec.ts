import { Controller, Get } from "../lib/controller";
import { App, AppLoader } from "../lib/init";
import { Package } from "../lib/package";
import { MainTest } from "./simple_base";

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
        await instance.run([
            MainTest
        ]);
        console.log(instance.express._router.stack)
        // expect(instance instanceof AppLoader).toBe(true);
    });

});
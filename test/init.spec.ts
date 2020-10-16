import { App, AppLoader } from "../lib/init";

describe('App', () => {

    test(`When 'init' is called, return an instance of 'AppLoader'`, () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        expect(instance instanceof AppLoader).toBe(true);
    });

});
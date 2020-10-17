import * as Supertest from 'supertest';
import { App } from '../../lib/init';
import { MainTest as BF } from '../structure/basic_flow';
import { MainTest as MF1 } from '../structure/express_and_input';
import { MainTest as MF2 } from '../structure/simple_output';

describe('End to End', () => {

    test('When rendering in the routing method, from an input method', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            BF
        ]);
        const response = await Supertest(instance.express)
                            .get('/test');
        expect(response.body).toStrictEqual({
            data: 'bar'
        });
    });

    test('When entering an inflow with Pipe, it is visible in the routing method', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            MF1
        ]);
        const response = await Supertest(instance.express)
                            .get('/test');
        expect(response.body).toStrictEqual({
            data: 'bar+'
        });
    });

    test('When an output is entered that renders from the return of an object', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            MF2
        ]);
        const response = await Supertest(instance.express)
                            .get('/test');
        expect(response.body).toStrictEqual({
            data: 'bar'
        });
    });

});
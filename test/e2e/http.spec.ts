import * as Supertest from 'supertest';
import { App } from '../../lib/init';
import { MainTest as BF } from '../structure/basic_flow';
import { MainTest as MF1 } from '../structure/express_and_input';
import { MainTest as MF2 } from '../structure/simple_output';
import { MainTest as MF3 } from '../structure/multiple_methods';
import { MainTest as MF4 } from '../structure/simple_prefix';

describe('End to End', () => {

    test('When rendering in the routing method, from an input method', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            BF,
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
            data: 'bar+',
            original: 'bar'
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

    test('When a route has multiple verbs, respond to them in the same way', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            MF3
        ]);
        const responseGet = await Supertest(instance.express)
                            .get('/test');
        const responsePost = await Supertest(instance.express)
                            .post('/test');
        expect(responseGet.body).toStrictEqual({
            data: 'bar'
        });
        expect(responsePost.body).toStrictEqual({
            data: 'bar'
        });
    });

    test('When a route has prefix, find route', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            MF4
        ]);
        const responseGet = await Supertest(instance.express)
                            .get('/base/test');
        const responsePost = await Supertest(instance.express)
                            .post('/base/test');
        expect(responseGet.body).toStrictEqual({
            data: 'bar'
        });
        expect(responsePost.body).toStrictEqual({
            data: 'bar'
        });
    });

});
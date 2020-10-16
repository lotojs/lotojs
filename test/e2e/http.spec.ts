import * as Supertest from 'supertest';
import { App } from '../../lib/init';
import { MainTest as BF } from '../structure/basic_flow';
import { MainTest as MF1 } from '../structure/medium_flow';

describe('End to End', () => {

    test('', async () => {
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

    test('', async () => {
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

});
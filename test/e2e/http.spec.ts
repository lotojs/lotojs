import * as Supertest from 'supertest';
import { App } from '../../lib/init';
import { MainTest } from '../structure/basic_flow';

describe('End to End', () => {

    test('', async () => {
        const instance = App.init(
            {
                runServer: false
            }
        );
        await instance.run([
            MainTest
        ]);
        const response = await Supertest(instance.express)
                            .get('/test');
        expect(response.body).toStrictEqual({
            data: 'bar'
        });
    });

});
import * as morgan from 'morgan';
import { ContextSave, Controller, Get, Input, Obtain, Pipe, Request, Response, Save } from "../../lib/controller";
import { Package } from "../../lib/package";
import { ContextRoute } from "../../lib/router";

@Controller()
export class TestController{

    @Input(Pipe(
        [
            Obtain('foo'),
            (req, res, next, context : ContextRoute) => {
                req.app.foo = context.input + '+';
                next();
            }
        ]
    ))
    @Get("/test")
    test(
        @Response()
        res : any,
        @Request()
        req : any,
        @ContextSave('foo')
        foo : String
    ){
        res.json({
            data: req.app.foo,
            original: foo
        });
    }

}

@Package({
    inputs: [
        morgan(),
        Save(
            (req, res, next) => {
                next();
                return 'bar';
            },
            'foo'
        )
    ],
    controllers: [
        TestController
    ]
})
export class MainTest{}
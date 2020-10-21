import { Controller, Get, Input, Request, Response } from "../../lib/controller";
import { Package } from "../../lib/package";
import { Action } from "../../lib/types";

@Controller()
export class TestController{

    @Input((req, res) => {
        req.app.foo = 'bar';
    })
    @Get("/test")
    test(
        @Response()
        res : Action.Response,
        @Request()
        req : Action.Request
    ){
        res.json({
            data: (req.app as any).foo
        });
    }

}

@Package({
    controllers: [
        TestController
    ]
})
export class MainTest{}
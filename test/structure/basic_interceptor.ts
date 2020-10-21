import { Controller, Get, Input, Request, Response } from "../../lib/controller";
import { Package } from "../../lib/package";
import { Action, ContextRoute } from "../../lib/types";

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
        throw new Error("My fatal error");
    }

}

@Package({
    controllers: [
        TestController
    ],
    interceptor: (req, res, exception : any) => {
        res.status(500).json({
            message: exception.message
        });
    }
})
export class MainTest{}
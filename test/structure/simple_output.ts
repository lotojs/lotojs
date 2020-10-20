import { Controller, Get, Input, Obtain, Pipe, Request, Response, Save } from "../../lib/controller";
import { Package } from "../../lib/package";
import { ContextRoute } from "../../lib/types";

@Controller()
export class TestController{

    @Get("/test")
    test(
        @Response()
        res : any,
        @Request()
        req : any
    ){
        return {
            data: 'bar'
        }
    }

}

@Package({
    outputs: [
        (req, res, next, context : ContextRoute) => {
            next();
            res.json(context.input);
        }
    ],
    controllers: [
        TestController
    ]
})
export class MainTest{}
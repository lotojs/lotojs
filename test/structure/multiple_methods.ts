import { Controller, Get, Input, Obtain, Pipe, Post, Request, Response, Save } from "../../lib/controller";
import { Package } from "../../lib/package";
import { ContextRoute } from "../../lib/router";

@Controller()
export class TestController{

    @Get("/test")
    @Post()
    test(
        @Response()
        res : any,
        @Request()
        req : any
    ){
        res.json({
            data: 'bar'
        })
    }

}

@Package({
    controllers: [
        TestController
    ]
})
export class MainTest{}
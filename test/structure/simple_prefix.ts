import { Controller, Get, Post, Request, Response } from "../../lib/controller";
import { Package } from "../../lib/package";

@Controller("/test")
export class TestController{

    @Get()
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
    base: '/base',
    controllers: [
        TestController
    ]
})
export class MainTest{}
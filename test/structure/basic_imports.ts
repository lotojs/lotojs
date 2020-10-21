import { Controller, Get, Input, Request, Response } from "../../lib/controller";
import { Package } from "../../lib/package";

@Controller()
export class TestController{

    @Input((req, res) => {
        req.app.foo = 'bar';
    })
    @Get("/test")
    test(
        @Response()
        res : any,
        @Request()
        req : any
    ){
        res.json({
            data: req.app.foo
        });
    }

}

@Package({
    controllers: [
        TestController
    ]
})
export class MainTestSubSub{}

@Package({
    joins: [
        MainTestSubSub
    ]
})
export class MainTestSub{}

@Package({
    joins: [
        MainTestSub
    ]
})
export class MainTest{}
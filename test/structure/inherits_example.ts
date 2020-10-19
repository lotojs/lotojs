import { ContextSave, Controller, Get, Save, Response } from "../../lib/controller";
import { Package } from "../../lib/package";

@Controller()
export class TestController{

    @Get("/test")
    test(){
        return {};
    }

}

@Package({
    base: '/base',
    controllers: [
        TestController
    ],
    inputs: [
        Save(
            (req, res, next) => {
                next();
                return 'bar';
            },
            'foo'
        )
    ]
})
export class MainTest{}

@Controller()
export class TestControllerSub{

    @Get("/test")
    test(
        @ContextSave('foo')
        foo : string,
        @Response()
        res : any,
    ){
        res.json({
            data: foo
        })
    }

}

@Package({
    controllers: [
        TestControllerSub
    ],
    inherits: [
        {
            package: MainTest,
            includeBase: true,
        }
    ]
})
export class MainTestSub{}
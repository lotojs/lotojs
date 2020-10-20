import { ContextSave, Controller, DefineMiddleware, Get, Input, Request, Response, Save } from "../../lib/controller";
import { Package } from "../../lib/package";
import { Middleware } from "../../lib/types";

@DefineMiddleware()
export class CustomMiddleware implements Middleware{

    middleware(req: any, res: any, next: any, context: any) {
        next();
        return 'customvalue';
    }
    
}

@Controller()
export class TestController{

    @Input(Save(CustomMiddleware, 'foo'))
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
            data: foo
        });
    }

}

@Package({
    controllers: [
        TestController
    ]
})
export class MainTest{}
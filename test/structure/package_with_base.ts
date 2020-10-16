import { Controller, Get } from "../../lib/controller";
import { Package } from "../../lib/package";

@Controller("/mycontroller/")
export class TestController{

    @Get("/test")
    test(){
        return {};
    }

}

@Package({
    base: '/mybase/',
    controllers: [
        TestController
    ]
})
export class MainTest{}
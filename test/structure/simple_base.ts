import { Controller, Get } from "../../lib/controller";
import { Package } from "../../lib/package";

@Controller()
export class TestController{

    @Get("/test")
    test(){
        return {};
    }

}

@Package({
    controllers: [
        TestController
    ]
})
export class MainTest{}
import { App, AppLoader } from "../lib/init";
import { MainTest } from "./structure/simple_base";
import { MainTest as MainTestBase } from "./structure/package_with_base";

describe("App", () => {
  test(`When 'init' is called, return an instance of 'AppLoader'`, () => {
    const instance = App.init([], {
      runServer: false,
    });
    expect(instance instanceof AppLoader).toBe(true);
  });

  test(`When 'run' is called, load all packages`, async () => {
    const instance = App.init([MainTest]);
    instance.express._router.stack.forEach((value) => {
      if (value.route) expect(value.route.path).toBe("/test");
    });
  });

  test(`When 'run' is called, load all packages with base defined`, async () => {
    const instance = App.init([MainTestBase]);
    instance.express._router.stack.forEach((value) => {
      if (value.route)
        expect(value.route.path).toBe("/mybase/mycontroller/test");
    });
  });
});

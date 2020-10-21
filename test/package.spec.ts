import { Package } from "../lib/package";

describe("@Package", () => {
  test("When the @Package is inserted, add metadata", () => {
    const obj = jest.fn();
    const execute = Package({
      controllers: [],
      inputs: [],
      interceptor: undefined,
      outputs: [],
    });
    execute(obj);
    expect(obj.prototype).toHaveProperty("metadata.id");
    expect(obj.prototype).toHaveProperty("metadata.type", "package");
    expect(obj.prototype).toHaveProperty("metadata.controllers", []);
    expect(obj.prototype).toHaveProperty("metadata.inputs", []);
    expect(obj.prototype).toHaveProperty("metadata.outputs", []);
    expect(obj.prototype).toHaveProperty("metadata.interceptor", undefined);
  });
});

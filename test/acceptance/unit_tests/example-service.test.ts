import "reflect-metadata";
import ExampleService from "../../../src/infrastructure/example-service";

const exampleService = new ExampleService();

describe("the Data Source", () => {
  it("will return data", async () => {
    const id = "1234";
    const data = await exampleService.getData(id);
    expect(data.id).toBe(id);
    expect(data.data).toBe("abc");
  });
});

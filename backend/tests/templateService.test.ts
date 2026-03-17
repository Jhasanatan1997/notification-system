import { renderTemplate } from "../src/services/templateService.js";

describe("renderTemplate", () => {
  it("replaces {{var}} placeholders", () => {
    const out = renderTemplate("Hello {{name}}, order {{orderId}}", { name: "Sam", orderId: 123 });
    expect(out).toBe("Hello Sam, order 123");
  });

  it("renders missing vars as empty string", () => {
    const out = renderTemplate("Hi {{missing}}!", {});
    expect(out).toBe("Hi !");
  });
});


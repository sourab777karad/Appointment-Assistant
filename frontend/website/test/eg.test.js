const { JSDOM } = require("jsdom");

// Test the JSDOM import
test("JSDOM import should be successful", () => {
  expect(JSDOM).toBeDefined();
});


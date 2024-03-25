// Test if firebase is installed
test("firebase-admin is installed", () => {
  try {
    require("firebase-admin");
  } catch (error) {
    throw new Error("firebase is not installed");
  }
});

// Test if firebase is installed
test("firebase-admin is installed", () => {
	try {
		require("firebase-admin");
	} catch (error) {
		throw new Error("firebase is not installed");
	}
});

// Test mongodb connection to atlas using mongodb
test("mongodb is installed", () => {
	try {
		require("mongodb");
	} catch (error) {
		throw new Error("mongodb is not installed");
	}
});
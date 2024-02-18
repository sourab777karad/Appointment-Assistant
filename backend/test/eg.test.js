// Test if firebase is installed
test("firebase-admin is installed", () => {
	try {
		require("firebase-admin");
	} catch (error) {
		throw new Error("Mongoose is not installed");
	}
});

// Test if mongodb is installed
test("mongodb is installed", () => {
	try {
		require("mongodb");
	} catch (error) {
		throw new Error("Firebase is not installed");
	}
});

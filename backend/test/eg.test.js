// Test if firebase is installed
test("firebase-admin is installed", () => {
	try {
		require("firebase-admin");
	} catch (error) {
		throw new Error("firebase is not installed");
	}
});

// Test mongodb connection to atlas using mongodb

test("mongodb connection to atlas using mongodb", () => {
	try {
		 const mongodb = require("mongodb");
		mongodb.MongoClient.connect(${{secrets.MONGO_URI}}).catch(err => {
			console.error(err.stack);
			process.exit(1);
		})
	} catch (error) {
		console.log(error)
		throw new Error(`err ${error}`);
	}
});
import { io, userToSocketId } from "../index.js";

// Define a class called NotificationService
export default class NotificationService {

	// Define a static asynchronous method to send a message to a user
	static async sendMessagetoUser(firebaseId) {
		try {
			// Get the socket ID associated with the user's Firebase ID
			const socketId = userToSocketId.get(firebaseId);

			// If a socket ID is found, emit a "notification" event to that socket
			if (socketId) {
				io.to(socketId).emit("notification");
			}
			// If the operation is successful, return true
			return true;
		} catch (error) {
			console.error(`Failed to send message to appointee: ${error}`);
			return false;
		}
	}
}

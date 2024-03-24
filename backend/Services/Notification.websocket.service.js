import { io, userToSocketId } from "../index.js";

export default class NotificationService {
	static async sendMessagetoUser(firebaseId) {
		try {
			const socketId = userToSocketId.get(firebaseId);
			if (socketId) {
				io.to(socketId).emit("notification");
			}
			return true;
		} catch (error) {
			console.error(`Failed to send message to appointee: ${error}`);
			return false;
		}
	}
}

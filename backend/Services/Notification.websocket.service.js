import {io, userToSocketId} from "../index.js";

export default class NotificationService {
  static async sendMessageToScheduler(firebaseId, message) {
    try {
        console.log(userToSocketId)
        const socketId = userToSocketId.get(firebaseId);
        console.log(firebaseId, socketId);
      if (socketId) {
        io.to(socketId).emit("notification", message);
      }
    } catch (error) {
      console.error(`Failed to send message to scheduler: ${error}`);
    }
    
  }
}

import {io} from "../index.js";

export default class NotificationService {
  static async sendMessageToClient(message) {
    io.emit("message", message);
  }
}

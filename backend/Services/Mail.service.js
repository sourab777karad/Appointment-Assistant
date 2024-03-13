import { transporter } from '../index.js';  // Import the transporter
import {EMAIL_ID} from '../config/config.js';  // Import the email id
class MailController {
  // constructor 
  constructor() {
    this.transporter = transporter;  // Use the imported transporter
  }
  
  async sendMail(scheduler_email_id, status) {
    try {
      let text;
      if(status === "confirmed"){
        text ="Your appointment has been confirmed"
      } else {
        text = "Your appointment has been declined"
      }
     await this.transporter.sendMail({
      from: `"Appointment Assistant Admin" <${EMAIL_ID}>`,
      to: scheduler_email_id,
      subject: "Appointment Confirmation",
      text: text,
      })
      return true;
    }
    catch (err){
      console.error(err);
      return false;
    }
  }  
};
  
export default MailController;
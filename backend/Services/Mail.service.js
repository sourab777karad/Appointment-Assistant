import { transporter } from "../index.js"; // Import the transporter
import { EMAIL_ID } from "../config/config.js"; // Import the email id

// Define a class for handling mail operations
class MailController {
  // constructor
  constructor() {
    this.transporter = transporter; // Use the imported transporter
  }

  // Method to send an email
  async sendMail(
    scheduler_email_id,
    status,
    customMessage,
    appointee_name,
    appointment_time,
    appointment_date,
    appointment_end_time,
    appointment_location,
    appointee_email_id,
  ) {
    try {
      let text;
      // If the appointment status is confirmed, prepare a confirmation message
      if (status === "confirmed") {
        text = `Your appointment with ${appointee_name} has been confirmed. It will start at ${appointment_time} and end at ${appointment_end_time} on ${appointment_date}. The appointment will take place at ${appointment_location}. Please ensure you arrive on time and bring all necessary documents. If you have any questions, feel free to contact the respective faculty member at ${appointee_email_id}.`;
      } else {
        // If the appointment status is not confirmed, prepare a cancellation message
        text = `Your appointment with ${appointee_name} has been rejected. The faculty member has provided the following reason for the cancellation: ${customMessage}. Should you have any questions or concerns, please do not hesitate to reach out to the faculty member directly at ${appointee_email_id}.`;
      }
      // Send the email
      await this.transporter.sendMail({
        from: `"Appointment Assistant Admin" <${EMAIL_ID}>`,
        to: scheduler_email_id,
        subject: "Appointment Confirmation",
        text: text,
      });
      // If the email is sent successfully, return true
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
// Export the MailController class
export default MailController;

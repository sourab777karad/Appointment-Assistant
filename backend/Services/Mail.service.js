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
    appointment_duration,
    appointment_location,
    appointee_email_id,
  ) {
    try {
      let text;
      // If the appointment status is confirmed, prepare a confirmation message
      if (status === "confirmed") {
        text = `Your appointment has been confirmed with ${appointee_name} at ${appointment_time} on ${appointment_date} for a duration of ${appointment_duration} minutes. The appointment is scheduled at ${appointment_location}. Please be on time and bring all the necessary documents. If you have any questions, please feel free to contact the respected Faculty ${appointee_email_id}.`;
      } else {
        // If the appointment status is not confirmed, prepare a cancellation message
        text = `Your appointment has been cancelled with ${appointee_name} at ${appointment_time} on ${appointment_date} for a duration of ${appointment_duration} minutes. The appointment was scheduled at ${appointment_location}. If you have any questions, please feel free to contact the respected Faculty ${appointee_email_id}.
            The reason for cancellation provided by the faculty is: ${customMessage}`;
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

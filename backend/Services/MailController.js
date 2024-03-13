import nodemailer from 'nodemailer';

class MailController {
  static async acceptAppointment(req, res) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maihoonkon30@gmail.com',
        pass: 'Maihihoon30'
      }
    });

    let info = await transporter.sendMail({
      from: '"Appointment System" <maihoonkon30@gmail.com>',
      to: '1032210888@mitwpu.edu.in',
      subject: "Appointment Accepted",
      text: `The appointment with ${req.body.user_email} has been accepted.`,
    });

    return info;
  }

  static async declineAppointment(req, res) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maihoonkon30@gmail.com',
        pass: 'Maihihoon30'
      }
    });

    let info = await transporter.sendMail({
      from: '"Appointment System" <maihoonkon30@gmail.com>',
      to: '1032210888@mitwpu.edu.in',
      subject: "Appointment Declined",
      text: `We're sorry, but the appointment with ${req.body.user_email} has been declined.`,
    });

    return info;
  }
}

export default MailController;
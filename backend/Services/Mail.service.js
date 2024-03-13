import nodemailer from 'nodemailer';

class MailController {
  // constructor 
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maihoonkon30@gmail.com',
        pass: 'Maihihoon30'
      }
    });
  }
  
  async sendMail(scheduler_email_id, status) {
    try {
      if(status === "confirmed"){
        text ="Your appointment has been confirmed"
      } else {
        text = "Your appointment has been declined"
      }
     await transporter.sendMail({
      from: '"Appointment System" <maihoonkon30@gmail.com>',
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
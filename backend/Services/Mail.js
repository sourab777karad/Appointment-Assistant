import express from 'express';
import MailController from './Mailcontroller.js';

const router = express.Router();

router.post('/acceptAppointment', async (req, res) => {
  try {
    let info = await MailController.acceptAppointment(req, res);

    return res.status(200).json({ message: "Email sent", info });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error sending email" });
  }
});

router.post('/declineAppointment', async (req, res) => {
  try {
    let info = await MailController.declineAppointment(req, res);

    return res.status(200).json({ message: "Email sent", info });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error sending email" });
  }
});

export default router;



















// import nodemailer from 'nodemailer';
// import express from 'express';
// import authenticator from './auth/authenticator.js';

// const router = express.Router();
// async function confirmAppointment(req, res) {
//   try {
//     const user_email = req.body.email;

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'Maihoonkon30@gmail.com', // replace with your email
//         pass: 'Maihihoon123' // replace with your password
//       }
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Appointment System" <Karadsaisourab9@gmail.com>', // sender address
//       to: 'maihoonkon30@gmail.com', // your email address
//       subject: "Appointment Confirmed", // Subject line
//       text: `The appointment with ${user_email} has been successfully booked.`, // plain text body
//     });

//     return res.status(200).json({ message: "Email sent", info });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error sending email" });
//   }
// }

// async function declineAppointment(req, res) {
//   try {
//     const user_email = req.body.email;

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'Maihoonkon30@gmail.com', // replace with your email
//         pass: 'Maihihoon123' // replace with your password
//       }
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Appointment System" <Karadsaisourab9@gmail.com>', // sender address
//       to: 'maihoonkon30@gmail.com', // your email address
//       subject: "Appointment Declined", // Subject line
//       text: `We're sorry, but the appointment with ${user_email} has been declined.`, // plain text body
//     });

//     return res.status(200).json({ message: "Email sent", info });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error sending email" });
//   }
// }

// router.post('/confirmAppointment', authenticator.TokenAuthenticator, MailController.confirmAppointment);

// router.post('/declineAppointment', authenticator.TokenAuthenticator, MailController.declineAppointment);
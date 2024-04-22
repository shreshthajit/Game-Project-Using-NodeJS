const nodemailer = require('nodemailer');
const projectConfig = require('../config');

const sendEmail = async (email, subject, html) => {
   // Define email options
   const mailOptions = {
      from: projectConfig.email.address,
      to: email,
      subject: subject,
      html: html
   }

   // Create a transporter using SMTP settings
   const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
         user: projectConfig.email.address,
         pass: projectConfig.email.password,
      }
   });

   try {
      // Send the email
      const res = await transporter.sendMail(mailOptions);
      // Return true if the email was sent successfully, otherwise false
      return !res ? false : true;
   } catch (error) {
      // Log any errors and return false
      console.log(error);
      return false;
   }
};

module.exports = { sendEmail };

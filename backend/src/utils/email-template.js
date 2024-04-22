const forgotPasswordEmailTemplate = (url) => {
  return `<!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <style>
         body {
           font-family: Arial, sans-serif;
           background-color: #f0f0f0;
           margin: 0;
           padding: 0;
         }
         .container {
           max-width: 600px;
           margin: 0 auto;
           padding: 20px;
           background-color: #ffffff;
           border-radius: 5px;
           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
         }
         .header {
           background-color: #007BFF;
           padding: 20px;
           text-align: center;
           border-top-left-radius: 5px;
           border-top-right-radius: 5px;
         }
         .header h1 {
           color: #ffffff;
         }
         .content {
           padding: 20px;
         }
         .message {
           font-size: 18px;
           margin: 20px 0;
           color: #333;
         }
         .button {
           text-align: center;
           margin: 20px 0;
         }
         .button a {
           display: inline-block;
           padding: 10px 20px;
           background-color: #007BFF;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
         }
       </style>
     </head>
     <body>
       <div class="container">
         <div class="header">
           <h1>Password Reset</h1>
         </div>
         <div class="content">
           <p class="message">Hello there,</p>
           <p class="message">You've requested a password reset for your account. Click the button below to create a new password:</p>
           <div class="button">
             <a href="${url}">Reset Password</a>
           </div>
           <p class="message">If you didn't request this password reset, please ignore this email. Your account is secure.</p>
         </div>
       </div>
     </body>
     </html>
     `;
}

const commonEmailTemplate = (otp, date, message = 'change your password') => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Static Template</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
      <div
        style="
          max-width: 680px;
          margin: 0 auto;
          padding: 45px 30px 60px;
          background: #9d0fac;
          background-repeat: no-repeat;
          background-size: 800px 452px;
          background-position: top center;
          font-size: 14px;
          color: #434343;
        "
      >
        <header>
          <table style="width: 100%">
            <tbody>
              <tr style="height: 0">
                <td>
                  <img
                    alt=""
                    src="https://pub-5b944529fc0f44d6902fd73fb389c176.r2.dev/Logos%2Flogo_sqr.png"
                    height="30px"
                  />
                </td>
                <td style="text-align: right">
                  <span style="font-size: 16px; line-height: 30px; color: #ffffff"
                    >${date}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 70px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your OTP
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey there 👋,
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                We noticed that you've requested to ${message} on
                Skillzy. To proceed, please use the following One-Time Password
                (OTP) within the next
                <span style="font-weight: 600; color: #1f1f1f">5 minutes</span>.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 60px;
                  font-size: 40px;
                  font-weight: 600;
                  letter-spacing: 25px;
                  color: #ba3d4f;
                "
              >
                ${otp}
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #1b1a1a;
            "
          >
            Need help? Ask at
            <a
              href="mailto:contact.skillzy.io@gmail.com"
              style="color: #499fb6; text-decoration: none"
              >contact.skillzy.io@gmail.com</a
            >
            or visit our
            <a
              href="https://www.skillzy.io/"
              target="_blank"
              style="color: #499fb6; text-decoration: none"
              >Help Center</a
            >
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #1b1a1a;
            "
          >
            Skillzy.io
          </p>
          <p style="margin: 0; margin-top: 8px; color: #1b1a1a">
            Pune, Maharashtra 411033, IN
          </p>
          <div style="margin: 0; margin-top: 16px">
            <a
              href="https://www.linkedin.com/company/skillzy-io/"
              target="_blank"
              style="display: inline-block"
            >
              <img
                width="36px"
                alt="Linkedin"
                src="https://pub-5b944529fc0f44d6902fd73fb389c176.r2.dev/Logos%2Flinkedin.png"
              />
            </a>
            <a
              href="https://www.instagram.com/Skillzy.io/"
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://pub-5b944529fc0f44d6902fd73fb389c176.r2.dev/Logos%2Finstagram.png"
            /></a>
            <a
              href="https://play.google.com/store/apps/details?id=io.skillzy.android"
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Playstore"
                src="https://pub-5b944529fc0f44d6902fd73fb389c176.r2.dev/Logos%2Fplaystore.png"
              />
            </a>
            <a
              href="https://telegram.me/Skillzy_io"
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Telegram"
                src="https://pub-5b944529fc0f44d6902fd73fb389c176.r2.dev/Logos%2Ftelegram.png"
            /></a>
          </div>
          <p style="margin: 0; margin-top: 16px; color: #000000">
            Copyright © 2024 Skillzy.io All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>
  `
}

module.exports = { forgotPasswordEmailTemplate, commonEmailTemplate };
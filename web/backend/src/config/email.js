const sgMail = require("@sendgrid/mail");

//Set the API key for SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Send email using the transporter object and the email content
const sendEmail = async (emailContent) => {
  try {
    const msg = {
      to: emailContent.to,
      from: process.env.EMAIL_USER,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const info = await sgMail.send(msg);
    console.log("Email sent: ", info[0].statusCode);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendEmail;

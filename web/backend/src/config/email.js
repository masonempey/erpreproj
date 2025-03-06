const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content (used if templateId is not provided)
 * @param {string} options.templateId - SendGrid template ID
 * @param {Object} options.dynamicTemplateData - Dynamic data for the template
 * @returns {Promise} - Promise representing the mail send operation
 */
const sendEmail = async (options) => {
  console.log("Sending email with options:", options);
  const msg = {
    to: options.to,
    from: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_NAME,
    },
    templateId: options.templateId,
    dynamicTemplateData: options.dynamicTemplateData,
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error("SendGrid Response:", error.response.body);
    }
    throw error;
  }
};

module.exports = sendEmail;

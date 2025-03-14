// lib/services/email.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Template IDs from SendGrid
const TEMPLATE_IDS = {
  // REMINDER: 'd-your-reminder-template-id',
  // CANCELLATION: 'd-your-cancellation-template-id',
  NEWSLETTER: "d-8c503fbf151a4314a3d6cd1d0281b463",
  CONFIRMATION: "d-a9b9d1ebc67b40b982ca1c0f229943c0",
};

export async function sendConfirmationEmail(appointment) {
  console.log("APPOINTMENT INFO: ", appointment);

  // Check if email exists directly or in guestDetails
  const recipientEmail =
    appointment.email ||
    (appointment.guestDetails && appointment.guestDetails.email);

  if (!recipientEmail) {
    throw new Error("No recipient email address provided");
  }

  // Get the date as a Date object
  const appointmentDate = new Date(appointment.date);

  return await sendEmail({
    to: recipientEmail,
    templateId: TEMPLATE_IDS.CONFIRMATION,
    dynamicTemplateData: {
      customerName:
        appointment.customerName ||
        (appointment.guestDetails && appointment.guestDetails.name),
      appointmentDate: appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      barberName: appointment.barberName,
      serviceType:
        appointment.serviceType ||
        (appointment.services && appointment.services.length > 0
          ? appointment.services[0]
          : ""),
    },
  });
}

export async function sendNewsletter(newsLetterData) {
  return await sendEmail({
    to: newsLetterData.recipientEmail,
    templateId: TEMPLATE_IDS.NEWSLETTER,
    dynamicTemplateData: {
      customerName: newsLetterData.customerName,
    },
  });
}

async function sendEmail(options) {
  const msg = {
    to: options.to,
    from: process.env.EMAIL_FROM,
    templateId: options.templateId,
    dynamicTemplateData: options.dynamicTemplateData,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

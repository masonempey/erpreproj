// Cancellation email template

module.exports = (appointment) => {
  return {
    subject: "Appointment Cancellation",
    text: `Dear ${appointment.customerName}, your appointment with ${appointment.barberName} on ${appointment.date} at ${appointment.time} has been cancelled.`,
    html: `<p>Dear ${appointment.customerName},</p><p>Your appointment with ${appointment.barberName} on ${appointment.date} at ${appointment.time} has been cancelled.</p>`,
  };
};

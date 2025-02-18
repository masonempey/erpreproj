// Reminder email template

module.exports = (appointment) => {
  return {
    subject: "Appointment Reminder",
    text: `Dear ${appointment.customerName}, this is a reminder for your appointment with ${appointment.barberName} on ${appointment.date} at ${appointment.time}.`,
    html: `<p>Dear ${appointment.customerName},</p><p>This is a reminder for your appointment with ${appointment.barberName} on ${appointment.date} at ${appointment.time}.</p>`,
  };
};

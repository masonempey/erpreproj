const express = require("express");
const router = express.Router();
const sendEmail = require("../config/email");
const appointmentReminderTemplate = require("../templates/appointmentReminder");
const appointmentCancellationTemplate = require("../templates/appointmentCancellation");

// Send appointment reminder
router.post("/send-reminder", async (req, res) => {
  const { appointment } = req.body;

  try {
    //Take the appointment object, pass it into the reminder template to create the emailContent object
    const emailContent = appointmentReminderTemplate(appointment);
    //Send the email using the emailContent and appointment object
    await sendEmail({
      to: appointment.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.status(200).send("Reminder email sent successfully");
  } catch (err) {
    console.error("Error sending reminder email:", err);
    res.status(500).send("Error sending reminder email");
  }
});

// Send appointment cancellation
router.post("/send-cancellation", async (req, res) => {
  const { appointment } = req.body;

  try {
    //Take the appointment object, pass it into the cancellation template to create the emailContent object
    const emailContent = appointmentCancellationTemplate(appointment);
    //Send the email using the emailContent object
    await sendEmail({
      to: appointment.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.status(200).send("Cancellation email sent successfully");
  } catch (err) {
    console.error("Error sending cancellation email:", err);
    res.status(500).send("Error sending cancellation email");
  }
});

module.exports = router;

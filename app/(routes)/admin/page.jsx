"use client";
import { useEffect, useState } from "react";
import Calendar from "../../components/Calendar";
import dayjs from "dayjs";
import styles from "../../styles/Admin.module.css";
import { useUser } from "../../../context/UserContext";
import AdminNavBar from "../../components/AdminNavBar";
import TimeSlot from "../../components/TimeSlot";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { red, grey } from "@mui/material/colors";
import TutorialDisplay from "../../components/TutorialDisplay";

export default function Admin() {
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      customerName: "John Doe",
      phone: "403-456-7890",
      email: "johndoe@gmail.com",
      serviceType: "Men's Haircut",
      startTime: "2025-03-14T10:15:00",
      endTime: "2025-03-14T11:00:00",
    },
    {
      id: "2",
      customerName: "Alice Smith",
      phone: "403-777-8888",
      email: "alice_smith@gmail.com",
      serviceType: "Haircut & Hairwash",
      startTime: "2025-03-14T11:00:00",
      endTime: "2025-03-14T11:45:00",
    },
    {
      id: "3",
      customerName: "Robert Brown",
      phone: "403-830-1234",
      email: "robert.b@gmail.com",
      serviceType: "Beard Trim",
      startTime: "2025-03-14T12:30:00",
      endTime: "2025-03-14T13:15:00",
    },
    {
      id: "4",
      customerName: "Emily Davis",
      phone: "403-232-9191",
      email: "em.davis@gmail.com",
      serviceType: "Womens's Haircut",
      startTime: "2025-03-18T14:00:00",
      endTime: "2025-03-18T14:45:00",
    },
    {
      id: "5",
      customerName: "Chris Wilson",
      phone: "403-111-1212",
      email: "chris@gmail.com",
      serviceType: "Kid's Haircut",
      startTime: "2025-03-18T15:30:00",
      endTime: "2025-03-18T16:15:00",
    },
    {
      id: "6",
      customerName: "Laura Smith",
      phone: "403-273-0102",
      email: "smithl@gmail.com",
      serviceType: "Womens's Haircut",
      startTime: "2025-03-17T09:30:00",
      endTime: "2025-03-17T10:15:00",
    },
    {
      id: "7",
      customerName: "David Lee",
      phone: "403-587-987",
      email: "lee_david@gmail.com",
      serviceType: "Beard Trim",
      startTime: "2025-03-17T10:15:00",
      endTime: "2025-03-17T11:00:00",
    },
    {
      id: "8",
      customerName: "Rachel Green",
      phone: "403-777-8888",
      email: "rgreen@gmail.com",
      serviceType: "Hair Perm",
      startTime: "2025-03-18T13:15:00",
      endTime: "2025-03-18T14:00:00",
    },
    {
      id: "9",
      customerName: "James Carter",
      phone: "403-000-0131",
      email: "carterjames@gmail.com",
      serviceType: "Men's Haircut",
      startTime: "2025-03-14T16:15:00",
      endTime: "2025-03-14T17:00:00",
    },
    {
      id: "10",
      customerName: "Sophia Turner",
      phone: "403-876-3456",
      email: "turner137@gmail.com",
      serviceType: "Womens's Haircut",
      startTime: "2025-03-17T11:45:00",
      endTime: "2025-03-17T12:30:00",
    },
  ]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedView, setSelectedView] = useState("Dashboard");
  const [appointmentsThisDay, setAppointmentsThisDay] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isTutorial, toggleTutorial] = useState(false);
  const [position, setPosition] = useState({ x: "50%", y: "50%" });
  const [tutorialDisplay, setTutorialDisplay] = useState(null);
  const [isTutorialVisible, ToggleTutorialVisibility] = useState(false);
  const [tutorialPosition, setTutorialPosition] = useState({
    x: "50%",
    y: "50%",
  });

  const handleChangeView = (view) => {
    setSelectedView(view);

    if (view === "Tutorial") {
      handleTutorialDisplay(
        null,
        "You have clicked the button to view the tutorial! You can view the tutorial at any time by clicking this button!"
      );
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    if (isTutorial) {
      handleTutorialDisplay(
        null,
        "View your customers appointment details here! You can view their contact information and the service they are scheduled for!"
      );
    }
  };

  const handleSetSelectedDate = (date) => {
    setSelectedDate(date);
    if (isTutorial) {
      handleTutorialDisplay(
        null,
        "You have clicked on the calendar! Here you can view your " +
          "appointments for the selected date! Click on a highlighted appointment to view more details!"
      );
    }
  };

  const handleTutorialDisplay = (e, display, visible = true) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const tutorialWidth = 500;
    const tutorialHeight = 300;

    if (e == null) {
      e = { clientX: screenWidth / 2, clientY: screenHeight / 2 - 150 };
    } else {
      if (e.clientX + tutorialWidth > screenWidth) {
        e.clientX = screenWidth - 300;
      }

      if (e.clientX < 250) {
        e.clientX = 300;
      }

      if (e.clientY < 150) {
        e.clientY = 200;
      }

      if (e.clientY + tutorialHeight > screenHeight) {
        e.clientY = screenHeight - 200;
      }
    }

    setTutorialDisplay(display);
    setTutorialPosition({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    ToggleTutorialVisibility(visible);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (selectedView === "Tutorial") {
      toggleTutorial(true);
    } else {
      toggleTutorial(false);
    }
  }, [selectedView]);

  useEffect(() => {
    const appointmentsSelected = appointments.filter((appointment) =>
      dayjs(appointment.startTime).isSame(selectedDate, "day")
    );
    setAppointmentsThisDay(appointmentsSelected);
    setSelectedAppointment(null);
  }, [selectedDate]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setPosition({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Map appointments to dayjs objects for the calendar
  const appointmentDays = appointments.map((appointment) =>
    dayjs(appointment.startTime)
  );

  return (
    <main>
      <AdminNavBar
        handleChangeView={handleChangeView}
        selectedView={selectedView}
        tutorialDisplay={tutorialDisplay}
        handleTutorialDisplay={handleTutorialDisplay}
      />
      <div className={styles.dashboard}>
        <section className={styles.view}>
          <div className={styles.calendar}>
            <Calendar
              handleSetSelectedDate={handleSetSelectedDate}
              selectedDate={selectedDate}
              appointmentDays={appointmentDays}
            />
          </div>
          <div className={styles.appointments}>
            {selectedAppointment ? (
              <div className={styles.appointmentDetails}>
                <div className={styles.appointmentButtons}>
                  <ArrowBackIcon
                    onClick={() => setSelectedAppointment(null)}
                    sx={{
                      cursor: "pointer",
                      fontSize: 50,
                      bgcolor: grey[300],
                      borderRadius: "20%",
                      width: 80,
                      mb: 2,
                    }}
                  />
                  <DoDisturbOnIcon
                    onClick={() => setSelectedAppointment(null)}
                    sx={{
                      cursor: "pointer",
                      fontSize: 50,
                      bgcolor: grey[300],
                      borderRadius: "20%",
                      width: 80,
                      mb: 2,
                      color: red[500],
                    }}
                  />
                </div>
                <div className={styles.appointmentHeader}>
                  <h2>Appointment Details</h2>
                  <Avatar
                    src="/broken-image.jpg"
                    sx={{ width: 120, height: 120, m: 3 }}
                  />
                </div>
                <div className={styles.appointmentInfo}>
                  <p>
                    <span>Customer:</span> {selectedAppointment.customerName}
                  </p>
                  <p>
                    <span>Phone Number:</span> {selectedAppointment.phone}
                  </p>
                </div>
                <div className={styles.appointmentInfo}>
                  <p>
                    <span>Service:</span> {selectedAppointment.serviceType}
                  </p>
                  <p>
                    <span>Email:</span>{" "}
                    <a href={`$mailto:{selectedAppointment.email}`}>
                      {selectedAppointment.email}
                    </a>
                  </p>
                </div>
                <p className={styles.appointmentDate}>
                  <span>Appointment Time:</span>{" "}
                  {formatTime(selectedAppointment.startTime)} -{" "}
                  {formatTime(selectedAppointment.endTime)}
                </p>
              </div>
            ) : (
              <TimeSlot
                appointmentsThisDay={appointmentsThisDay}
                handleViewAppointment={handleViewAppointment}
              />
            )}
          </div>
        </section>
      </div>
      {isTutorial && (
        <div>
          <div
            className={styles.flashlightOverlay}
            style={{ "--x": position.x, "--y": position.y }}
          />
          {isTutorialVisible && (
            <TutorialDisplay
              tutorialDisplay={tutorialDisplay}
              tutorialPosition={tutorialPosition}
              isTutorialVisible={isTutorialVisible}
              handleTutorialDisplay={handleTutorialDisplay}
            />
          )}
        </div>
      )}
    </main>
  );
}

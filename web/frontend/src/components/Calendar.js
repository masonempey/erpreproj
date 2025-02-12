import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";

export default function Calendar( {handleSetSelectedDate, selectedDate, appointmentDays}) {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              disablePast
              disableHighlightToday
              fixedWeekNumber={6}
              value={selectedDate}
              onChange={(newValue) => handleSetSelectedDate(newValue)}
              onMonthChange={() => {}}
              views={["day"]}
              slots={{
                day: (props) => {
                  const { day, outsideCurrentMonth, ...other } = props;
                  const appointmentsThisMonth = !outsideCurrentMonth && appointmentDays.some((date) => date.isSame(day, "day"));
                  const isNextMonth = day.isAfter(dayjs(), "month");
                  const isPast = day.isBefore(dayjs(), "day");

                  const getColor = () => {
                    if (isPast) return "#D3D3D3"; // light-grey
                    if (isNextMonth) return "#4A4A4A"; // dark-grey
                    return "black";
                  };

                  const getFontWeight = () => {
                    if (isNextMonth) return "500";
                    if (isPast) return "100";
                    return "700";
                  }

                  return (
                    <Badge overlap="circular" variant={appointmentsThisMonth ? "dot" : ""}   
                    sx=
                      {{
                        "& .MuiBadge-badge": {  
                          backgroundColor: "#FF5733", // red-orange
                        },  
                      }}
                    >
                      <PickersDay {...other} day={day} sx={{color: getColor(), fontWeight: getFontWeight(), backgroundColor: ""}} />
                    </Badge>
                  );
                },
              }}
              sx= {{backgroundColor: "#fafafa", color: "#000", scale: { xs: 1.3, md: 1.5, lg: 1.8 }, borderRadius: 2, boxShadow: 24, m: 5}}
            />
      </LocalizationProvider>
    </div>
  );
 }
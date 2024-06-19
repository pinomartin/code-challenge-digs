import { ChallengeData } from "@/app/models/ChallengeData";

export const getMonthName = (month: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

export const parseAndSortData = (data: ChallengeData) => {
  if (data) {
    // Crear una copia de los datos del calendario
    let calendarData = data.calendar.map((item) => ({
      ...item,
      actions: item.actions.map((action) => ({
        ...action,
        scheduledDate: action.scheduledDate
          ? new Date(action.scheduledDate)
          : null,
        dayName: action.scheduledDate
          ? new Date(action.scheduledDate).toLocaleDateString("en-US", {
              weekday: "long",
            })
          : null,
      })),
    }));

    // Ordenar las acciones dentro de cada mes
    calendarData = calendarData.map((item) => ({
      ...item,
      actions: item.actions.sort((a, b) => {
        if (!a.scheduledDate && !b.scheduledDate) return 0;
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        //@ts-ignore
        return a.scheduledDate - b.scheduledDate;
      }),
    }));

    // Ordenar los meses cronológicamente
    calendarData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return calendarData;
  }
  return [];
};

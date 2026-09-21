function seedSchedules() {
  let sheet = getSheet_("Schedules");
  if (!sheet) {
    setupCoreSheets(); // Initialize sheets from schema
    sheet = getSheet_("Schedules");
    if (!sheet) return { ok: false, message: "Sheet Schedules tidak dapat dibuat secara otomatis. Harap jalankan 'setupCoreSheets' dari editor." };
  }

  // Teachers mapping
  const T = {
    Ri: "rido", // Ust. Rido
    Fi: "fikri", // Ust. Fikri
    AQ: "suherlan", // Ust. Suherlan (Aqidah)
    Si: "alan", // Ust. Alan
    Hi: "ivan", // Ust. Ivan
    Ti: "ivan",
    H: "zulfian",
    FQ: "suherlan",
    So: "suherlan",
    Fe: "feri",
    BA: "darmawan",
    AD: "alan",
    Ki: "alan",
    Dede: "dede",
    Nisa: "nisa"
  };

  const seedData = [
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "7 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Shorof",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "H. Hadits",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "H. Hadits",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "8 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Nahwu",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "9 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "11 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Olahraga",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "15.40",
    "EndTime": "17.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Ikhwan",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "H. Hadits",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "H. Hadits",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "12 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "H. Doa",
    "TeacherID": "ivan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "15.40",
    "EndTime": "17.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Ikhwan",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "suherlan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Adab",
    "TeacherID": "andre",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Senin",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Tilawah",
    "TeacherID": "ivan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Sirah",
    "TeacherID": "alan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Aqidah",
    "TeacherID": "dede",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Selasa",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fiqih",
    "TeacherID": "fikri",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Fe",
    "TeacherID": "feri",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Hadits",
    "TeacherID": "zulfian",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Rabu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Rijalul Hadits",
    "TeacherID": "rido",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Kitabah",
    "TeacherID": "darmawan",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Kamis",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Tafsir",
    "TeacherID": "alan",
    "StartTime": "11.10",
    "EndTime": "11.50"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Qowaid",
    "TeacherID": "suherlan",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Jumat",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "B. Arab",
    "TeacherID": "nisa",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "07.20",
    "EndTime": "08.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Balaghah",
    "TeacherID": "dede",
    "StartTime": "08.00",
    "EndTime": "08.40"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "08.40",
    "EndTime": "09.20"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "U. Fiqh",
    "TeacherID": "fikri",
    "StartTime": "09.20",
    "EndTime": "10.00"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "10.30",
    "EndTime": "11.10"
  },
  {
    "Type": "KBM",
    "DayOfWeek": "Sabtu",
    "ClassOrGroupName": "10 Akhwat",
    "SubjectOrActivityName": "Faraid",
    "TeacherID": "dede",
    "StartTime": "11.10",
    "EndTime": "11.50"
  }
];


  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = [];

  seedData.forEach((item, index) => {
    const rowData = {
      ScheduleID: "SCH" + Date.now() + index,
      Type: item.Type,
      TeacherID: item.TeacherID, // Username
      SubjectOrActivityName: item.SubjectOrActivityName,
      ClassOrGroupName: item.ClassOrGroupName,
      DayOfWeek: item.DayOfWeek,
      IsActive: true
    };

    const rowArray = headers.map(header => rowData[header] !== undefined ? rowData[header] : "");
    rows.push(rowArray);
  });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  }

  return { ok: true, message: "Berhasil menginput " + rows.length + " jadwal kelas 7 hingga 12 secara otomatis!" };
}

function seedMissingTeachers() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = spreadsheet.getSheetByName("Users");

  if (!usersSheet) return { ok: false, message: "Sheet Users tidak ditemukan" };

  const data = usersSheet.getDataRange().getValues();
  const existingUsernames = data.length > 1 ? data.slice(1).map(row => String(row[2]).toLowerCase().trim()) : [];

  const teachersToSeed = [
    { name: "Dede Nuriman", username: "dede" },
    { name: "Zulfian", username: "zulfian" },
    { name: "Bunga", username: "bunga" },
    { name: "Nisa", username: "nisa" },
    { name: "Feri", username: "feri" },
    { name: "Darmawan", username: "darmawan" },
    { name: "Rido", username: "rido" }
  ];

  const headers = data[0];
  let rowsAdded = 0;

  teachersToSeed.forEach(t => {
    if (!existingUsernames.includes(t.username.toLowerCase())) {
      const row = Array(headers.length).fill("");
      row[0] = "USR" + Date.now() + Math.floor(Math.random() * 1000); // UserID
      row[1] = t.name; // Name
      row[2] = t.username; // Username
      row[5] = "Ustadz"; // Role
      row[10] = "Aktif"; // Status
      row[11] = new Date().toISOString(); // CreatedAt

      // Default password: 123456
      const salt = Utilities.getUuid().substring(0, 8);
      row[8] = salt; // Salt
      if (typeof hashPasswordWithSalt === 'function') {
        row[9] = hashPasswordWithSalt("123456", salt); // PasswordHash
      }

      usersSheet.appendRow(row);
      rowsAdded++;
      Utilities.sleep(50); // prevent duplicate IDs
    }
  });

  console.log(`Berhasil menambahkan ${rowsAdded} akun pengajar baru! Password default: 123456`);
  return { ok: true, message: `Berhasil menambahkan ${rowsAdded} akun pengajar baru!` };
}

// Generated from Database_Jadwal_Pesantren_2026_MASTER_APP_REVISI.xlsx.
// Foto/jadwal lampiran dipakai sebagai referensi validasi; data operasional ada di konstanta ini.
/**
 * Legacy/demo migration dataset generated from the 2026 workbook.
 *
 * This file must never be treated as a customer's operational database.
 * Tenant installations are blocked from importing it; they use their own
 * spreadsheet and the schedule editor/import workflow instead.
 */
const MASTER_SCHEDULE_TEACHERS = [
  {
    "TeacherSourceID": "T001",
    "Name": "Ust. Dede",
    "Username": "dede",
    "ShortName": "Dede",
    "Aliases": ["Dede Nuriman", "Dede Nuriman Lc"],
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T002",
    "Name": "Ust. Andre",
    "Username": "andre",
    "ShortName": "Andre",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T003",
    "Name": "Ust. Alan",
    "Username": "alan",
    "ShortName": "Alan",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T004",
    "Name": "Ust. Feri",
    "Username": "feri",
    "ShortName": "Feri",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T005",
    "Name": "Ust. Rido",
    "Username": "rido",
    "ShortName": "Rido",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T006",
    "Name": "Ust. Fikri",
    "Username": "fikri",
    "ShortName": "Fikri",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T007",
    "Name": "Ust. Suherlan",
    "Username": "suherlan",
    "ShortName": "Suherlan",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T008",
    "Name": "Ustzh. Nisa",
    "Username": "nisa",
    "ShortName": "Nisa",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T009",
    "Name": "Ustzh. Selly",
    "Username": "selly",
    "ShortName": "Selly",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T010",
    "Name": "Musyrifah",
    "Username": "musyrifah",
    "ShortName": "Musyrifah",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T011",
    "Name": "Ust. Zulfian",
    "Username": "zulfian",
    "ShortName": "Zulfian",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T012",
    "Name": "Ust. Darmawan",
    "Username": "darmawan",
    "ShortName": "Darmawan",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T013",
    "Name": "Ust. Ivan",
    "Username": "ivan",
    "ShortName": "Ivan",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T014",
    "Name": "Ustzh. Aina",
    "Username": "aina",
    "ShortName": "Aina",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T015",
    "Name": "Ustzh. Khoirunnisa",
    "Username": "khoirunnisa",
    "ShortName": "Khoirunnisa",
    "Role": "Ustadz"
  },
  {
    "TeacherSourceID": "T016",
    "Name": "Ustzh. Bunga",
    "Username": "bunga",
    "ShortName": "Bunga",
    "Role": "Ustadz"
  }
];

const MASTER_ATTENDANCE_SCHEDULES = [
  {
    "ScheduleID": "MASTER-KBM-K0001",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0002",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0003",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0004",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0005",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0006",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0007",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0008",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0009",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0010",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0011",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0012",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0013",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0014",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0015",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0016",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0017",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0018",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0019",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0020",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0021",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0022",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0023",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0024",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0025",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0026",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0027",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0028",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0029",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0030",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0031",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0032",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0033",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0034",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0035",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0036",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0037",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0038",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0039",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0040",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0041",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0042",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0043",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0044",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0045",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0046",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0047",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0048",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0049",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0050",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0051",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0052",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0053",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0054",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0055",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0056",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0057",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0058",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0059",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0060",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0061",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0062",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0063",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0064",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0065",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0066",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0067",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0068",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "7 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0069",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0070",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0071",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0072",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0073",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0074",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0075",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0076",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0077",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0078",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0079",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0080",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0081",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0082",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0083",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0084",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0085",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0086",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Shorof",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0087",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0088",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0089",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0090",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0091",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0092",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0093",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0094",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0095",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0096",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0097",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0098",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0099",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0100",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0101",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0102",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0103",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0104",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0105",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0106",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0107",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0108",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0109",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0110",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0111",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0112",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0113",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0114",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0115",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0116",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0117",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0118",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0119",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0120",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0121",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0122",
    "Type": "KBM",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-KBM-K0123",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0124",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0125",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0126",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0127",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0128",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0129",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Hadits",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0130",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Hadits",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0131",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0132",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0133",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0134",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0135",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0136",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "8 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0137",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0138",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0139",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0140",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0141",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0142",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0143",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0144",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0145",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0146",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0147",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0148",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0149",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0150",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0151",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0152",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0153",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0154",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0155",
    "Type": "KBM",
    "TeacherID": "darmawan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T012"
  },
  {
    "ScheduleID": "MASTER-KBM-K0156",
    "Type": "KBM",
    "TeacherID": "darmawan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T012"
  },
  {
    "ScheduleID": "MASTER-KBM-K0157",
    "Type": "KBM",
    "TeacherID": "darmawan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T012"
  },
  {
    "ScheduleID": "MASTER-KBM-K0158",
    "Type": "KBM",
    "TeacherID": "darmawan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T012"
  },
  {
    "ScheduleID": "MASTER-KBM-K0159",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0160",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0161",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0162",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0163",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0164",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0165",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0166",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0167",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0168",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Nahwu",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0169",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0170",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "9 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0171",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0172",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0173",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0174",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0175",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0176",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0177",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0178",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0179",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0180",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0181",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0182",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0183",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0184",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0185",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0186",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0187",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0188",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0189",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0190",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0191",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0192",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0193",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0194",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0195",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0196",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0197",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0198",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0199",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0200",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0201",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0202",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0203",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0204",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "11 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0205",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0206",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0207",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0208",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0209",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0210",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0211",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0212",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0213",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0214",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0215",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0216",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0217",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0218",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0219",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0220",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0221",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0222",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0223",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0224",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0225",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0226",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0227",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0228",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0229",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0230",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0231",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0232",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0233",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0234",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0235",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0236",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0237",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0238",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0239",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0240",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0241",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0242",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0243",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0244",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0245",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0246",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0247",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0248",
    "Type": "KBM",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-KBM-K0249",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0250",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0251",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0252",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0253",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0254",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0255",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0256",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0257",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0258",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0259",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0260",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0261",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0262",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0263",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0264",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0265",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Hadits",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0266",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "H. Hadits",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0267",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0268",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0269",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0270",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0271",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0272",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "12 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0273",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0274",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0275",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0276",
    "Type": "KBM",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Doa",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-KBM-K0277",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0278",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0279",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0280",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0281",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0282",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0283",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0284",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0285",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0286",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0287",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0288",
    "Type": "KBM",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-KBM-K0289",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0290",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0291",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0292",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0293",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0294",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0295",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0296",
    "Type": "KBM",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-KBM-K0297",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0298",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0299",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0300",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0301",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0302",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0303",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0304",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0305",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0306",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0307",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0308",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Fiqh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0309",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0310",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Adab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0311",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0312",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Tilawah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0313",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0314",
    "Type": "KBM",
    "TeacherID": "nisa",
    "SubjectOrActivityName": "Siroh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T008"
  },
  {
    "ScheduleID": "MASTER-KBM-K0315",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0316",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Aqidah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0317",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0318",
    "Type": "KBM",
    "TeacherID": "fikri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T006"
  },
  {
    "ScheduleID": "MASTER-KBM-K0319",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0320",
    "Type": "KBM",
    "TeacherID": "feri",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T004"
  },
  {
    "ScheduleID": "MASTER-KBM-K0321",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0322",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Hadits",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0323",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0324",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0325",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0326",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0327",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0328",
    "Type": "KBM",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Kitabah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-KBM-K0329",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0330",
    "Type": "KBM",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Tafsir",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-KBM-K0331",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0332",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Qawaid",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0333",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0334",
    "Type": "KBM",
    "TeacherID": "selly",
    "SubjectOrActivityName": "Bahasa Arab",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T009"
  },
  {
    "ScheduleID": "MASTER-KBM-K0335",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "07:20",
    "EndTime": "08:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0336",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Balaghah",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:00",
    "EndTime": "08:40",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0337",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "08:40",
    "EndTime": "09:20",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0338",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Ushul Fiqh",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "09:20",
    "EndTime": "10:00",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0339",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "10:30",
    "EndTime": "11:10",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0340",
    "Type": "KBM",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Faraid",
    "ClassOrGroupName": "10 Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "11:10",
    "EndTime": "11:50",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-KBM-K0341",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "12 Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "15:40",
    "EndTime": "17:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-KBM-K0342",
    "Type": "KBM",
    "TeacherID": "rido",
    "SubjectOrActivityName": "Umum",
    "ClassOrGroupName": "10 Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "15:40",
    "EndTime": "17:00",
    "IsActive": true,
    "TeacherSourceID": "T005"
  },
  {
    "ScheduleID": "MASTER-NKBM-A001-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A002-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A003-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A004-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A005-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A006-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A008-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A009-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A010-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A011-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A015-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Bakti",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A016-zulfian",
    "Type": "Kegiatan",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Kajian Ust. Zulfian",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-NKBM-A017-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Suherlan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A017-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Suherlan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A018-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A018-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A018-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A018-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A019-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A019-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A019-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A020-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A020-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A020-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A022-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Kajian Ust. Dede",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Senin",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A023-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Kajian Bergilir",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A024-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Suherlan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A024-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Suherlan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A025-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Alan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A025-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Alan / Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Kamis",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A026-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A026-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Alan / Ust. Suherlan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A027-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Sabtu",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A028-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Ahad",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A030-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A030-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A030-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Selasa",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A031-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A031-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A031-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Ivan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Rabu",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A033-andre",
    "Type": "Kegiatan",
    "TeacherID": "andre",
    "SubjectOrActivityName": "Ust. Andre / Ust. Suherlan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T002"
  },
  {
    "ScheduleID": "MASTER-NKBM-A033-alan",
    "Type": "Kegiatan",
    "TeacherID": "alan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Suherlan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T003"
  },
  {
    "ScheduleID": "MASTER-NKBM-A033-suherlan",
    "Type": "Kegiatan",
    "TeacherID": "suherlan",
    "SubjectOrActivityName": "Ust. Andre / Ust. Suherlan / Ust. Alan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Jumat",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T007"
  },
  {
    "ScheduleID": "MASTER-NKBM-A035-ivan",
    "Type": "Kegiatan",
    "TeacherID": "ivan",
    "SubjectOrActivityName": "Ust. Ivan",
    "ClassOrGroupName": "Ikhwan",
    "DayOfWeek": "Ahad",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T013"
  },
  {
    "ScheduleID": "MASTER-NKBM-A036-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A037-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A038-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A039-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A040-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A041-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Alquran",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "05:00",
    "EndTime": "06:00",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A043-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A044-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A045-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A046-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "H. Bahasa",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "12:15",
    "EndTime": "12:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A050-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Bakti",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A051-zulfian",
    "Type": "Kegiatan",
    "TeacherID": "zulfian",
    "SubjectOrActivityName": "Kajian Ust. Zulfian",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T011"
  },
  {
    "ScheduleID": "MASTER-NKBM-A052-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A052-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A053-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A053-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A054-musyrifah",
    "Type": "Kegiatan",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Olahraga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-NKBM-A055-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A055-aina",
    "Type": "Kegiatan",
    "TeacherID": "aina",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Aina",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "15:30",
    "EndTime": "16:45",
    "IsActive": true,
    "TeacherSourceID": "T014"
  },
  {
    "ScheduleID": "MASTER-NKBM-A057-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Kajian Ust. Dede",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Senin",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A058-dede",
    "Type": "Kegiatan",
    "TeacherID": "dede",
    "SubjectOrActivityName": "Kajian Bergilir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T001"
  },
  {
    "ScheduleID": "MASTER-NKBM-A059-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A060-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A061-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A062-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Sabtu",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A063-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Ahad",
    "StartTime": "Maghrib",
    "EndTime": "Isya",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A065-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A065-khoirunnisa",
    "Type": "Kegiatan",
    "TeacherID": "khoirunnisa",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Selasa",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T015"
  },
  {
    "ScheduleID": "MASTER-NKBM-A066-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A066-khoirunnisa",
    "Type": "Kegiatan",
    "TeacherID": "khoirunnisa",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Rabu",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T015"
  },
  {
    "ScheduleID": "MASTER-NKBM-A067-musyrifah",
    "Type": "Kegiatan",
    "TeacherID": "musyrifah",
    "SubjectOrActivityName": "Musyahadah",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Kamis",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T010"
  },
  {
    "ScheduleID": "MASTER-NKBM-A068-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T016"
  },
  {
    "ScheduleID": "MASTER-NKBM-A068-khoirunnisa",
    "Type": "Kegiatan",
    "TeacherID": "khoirunnisa",
    "SubjectOrActivityName": "Ustzh. Bunga / Ustzh. Khoir",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Jumat",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T015"
  },
  {
    "ScheduleID": "MASTER-NKBM-A070-bunga",
    "Type": "Kegiatan",
    "TeacherID": "bunga",
    "SubjectOrActivityName": "Ustzh. Bunga",
    "ClassOrGroupName": "Akhwat",
    "DayOfWeek": "Ahad",
    "StartTime": "19:30",
    "EndTime": "20:30",
    "IsActive": true,
    "TeacherSourceID": "T016"
  }
];


function importMasterScheduleForAttendance(currentUser) {
  const sessionUser = requireSessionUser_(currentUser, { roles: ["Mudir", "Admin"] });
  if (isTenantInstallation_()) {
    throw new Error(
      "Sinkronisasi master bawaan dinonaktifkan pada mode pondok. Gunakan Tambah Jadwal atau impor template data pondok.",
    );
  }
  setupCoreSheets();
  const teacherResult = seedMissingTeachersFromMasterSchedule_(sessionUser);
  const cleanupResult = deactivateLegacyDemoSchedules_();
  const scheduleResult = seedMasterAttendanceSchedules_();
  const message =
    "Import jadwal master selesai: " +
    scheduleResult.created +
    " jadwal baru, " +
    scheduleResult.updated +
    " jadwal diperbarui, " +
    cleanupResult.deactivated +
    " jadwal demo lama dinonaktifkan, " +
    teacherResult.created +
    " akun pengajar baru, " +
    teacherResult.updated +
    " akun dipetakan.";
  PropertiesService.getScriptProperties().setProperty(
    "ATT_MASTER_DATA_VERSION",
    typeof ATTENDANCE_MASTER_DATA_VERSION !== "undefined"
      ? ATTENDANCE_MASTER_DATA_VERSION
      : "2026-09-24.2",
  );
  CacheService.getScriptCache().remove(ATTENDANCE_SCHEDULE_STATUS_CACHE_KEY);
  return {
    ok: true,
    message,
    data: {
      message,
      teachers: teacherResult,
      cleanup: cleanupResult,
      schedules: scheduleResult,
      source: "MASTER_ATTENDANCE_SCHEDULES",
      expected: MASTER_ATTENDANCE_SCHEDULES.length,
    },
  };
}

function seedMissingTeachersFromMasterSchedule_(actor) {
  setupSheetWithHeaders_(SHEET_USERS, USER_HEADERS);
  const sheet = getSheet_(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const usernameIndex = headers.indexOf("Username");
  const nameIndex = headers.indexOf("Name");
  const sourceIdIndex = headers.indexOf("TeacherSourceID");
  const updatedAtIndex = headers.indexOf("UpdatedAt");
  const rows = data.slice(1).map((row) => row.slice(0, headers.length));
  const existingRows = {};
  rows.forEach((row, index) => {
    const username = String(row[usernameIndex] || "").trim().toLowerCase();
    if (!existingRows[username]) existingRows[username] = [];
    existingRows[username].push(index);
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;
  MASTER_SCHEDULE_TEACHERS.forEach((teacher) => {
    const uname = String(teacher.Username || "").trim().toLowerCase();
    if (!uname) {
      skipped++;
      return;
    }
    const matchingRows = rows.reduce((indexes, row, rowIndex) => {
      const user = {
        Username: usernameIndex === -1 ? "" : row[usernameIndex],
        Name: nameIndex === -1 ? "" : row[nameIndex],
      };
      if (MASTER_teacherMatchesUser_(teacher, user)) indexes.push(rowIndex);
      return indexes;
    }, []);
    if (matchingRows.length) {
      matchingRows.forEach((rowIndex) => {
        if (String(rows[rowIndex][sourceIdIndex] || "") === teacher.TeacherSourceID) {
          skipped++;
          return;
        }
        rows[rowIndex][sourceIdIndex] = teacher.TeacherSourceID;
        if (updatedAtIndex !== -1) rows[rowIndex][updatedAtIndex] = new Date().toISOString();
        updated++;
      });
      return;
    }
    const salt = Utilities.getUuid().substring(0, 8);
    const passwordHash = hashPasswordWithSalt("123456", salt);
    const now = new Date().toISOString();
    const rowData = {
      UserID: "USR" + Date.now() + Math.floor(Math.random() * 1000),
      Name: teacher.Name,
      Username: teacher.Username,
      Email: "",
      Phone: "",
      Role: teacher.Role || "Ustadz",
      StudentID: "",
      Class: "",
      TeacherSourceID: teacher.TeacherSourceID,
      Salt: salt,
      PasswordHash: passwordHash,
      Status: "Active",
      CreatedAt: now,
      UpdatedAt: now,
      LastLogin: "",
    };
    rows.push(headers.map((header) => rowData[header] !== undefined ? rowData[header] : ""));
    existingRows[uname] = [rows.length - 1];
    created++;
    AUTH_appendAuditLog_("CREATE", "User", rowData.UserID, actor, {
      username: teacher.Username,
      role: rowData.Role,
      source: "master-schedule-import",
    });
  });

  if (rows.length) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  if (updated) {
    AUTH_appendAuditLog_("UPDATE", "UserTeacherMapping", "MASTER", actor, {
      updated,
      source: "master-schedule-import",
    });
  }
  return { created, updated, skipped, total: MASTER_SCHEDULE_TEACHERS.length };
}

function MASTER_normalizeTeacherToken_(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ustadzah|ustadz|ustzh|usth|ustz|ust\.|ust/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function MASTER_teacherMatchesUser_(teacher, user) {
  const username = MASTER_normalizeTeacherToken_(user && user.Username);
  const name = MASTER_normalizeTeacherToken_(user && user.Name);
  const usernameTokens = [teacher.Username].concat(teacher.UsernameAliases || []);
  const nameTokens = [teacher.Name, teacher.ShortName].concat(teacher.Aliases || []);
  return (
    (username && usernameTokens.some(
      (value) => MASTER_normalizeTeacherToken_(value) === username,
    )) ||
    (name && nameTokens.some(
      (value) => MASTER_normalizeTeacherToken_(value) === name,
    ))
  );
}

function deactivateLegacyDemoSchedules_() {
  const sheet = getSheet_(SHEET_SCHEDULES);
  if (!sheet || sheet.getLastRow() <= 1) return { deactivated: 0 };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const scheduleIdIndex = headers.indexOf("ScheduleID");
  const typeIndex = headers.indexOf("Type");
  const classIndex = headers.indexOf("ClassOrGroupName");
  const sourceIdIndex = headers.indexOf("TeacherSourceID");
  const startIndex = headers.indexOf("StartTime");
  const endIndex = headers.indexOf("EndTime");
  const activeIndex = headers.indexOf("IsActive");
  if (scheduleIdIndex === -1 || activeIndex === -1) return { deactivated: 0 };

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  let deactivated = 0;
  data.forEach((row, index) => {
    const scheduleId = String(row[scheduleIdIndex] || "").trim();
    const type = typeIndex === -1 ? "" : String(row[typeIndex] || "").trim();
    const className = classIndex === -1 ? "" : String(row[classIndex] || "").trim();
    const teacherSourceId = sourceIdIndex === -1 ? "" : String(row[sourceIdIndex] || "").trim();
    const startTime = startIndex === -1 ? "" : String(row[startIndex] || "").trim();
    const endTime = endIndex === -1 ? "" : String(row[endIndex] || "").trim();
    const isLegacyKbmSeed =
      /^SCH\d+$/.test(scheduleId) &&
      normalizeScheduleType_(type) === "KBM" &&
      /^\d{1,2}\s+(Ikhwan|Akhwat)$/i.test(className) &&
      (!teacherSourceId || !startTime || !endTime);
    const isLegacyDemo = /^SCH\d+$/.test(scheduleId) && !startTime && !endTime;
    if ((isLegacyDemo || isLegacyKbmSeed) && String(row[activeIndex]).toLowerCase() !== "false") {
      sheet.getRange(index + 2, activeIndex + 1).setValue(false);
      deactivated++;
    }
  });

  return { deactivated };
}

function seedMasterAttendanceSchedules_(lockAlreadyHeld) {
  const lock = LockService.getScriptLock();
  if (!lockAlreadyHeld) lock.waitLock(30000);
  try {
    setupSheetWithHeaders_(SHEET_SCHEDULES, CORE_SHEET_SCHEMAS.Schedules);
    const sheet = getSheet_(SHEET_SCHEDULES);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getDataRange().getValues();
    const idIndex = headers.indexOf("ScheduleID");
    const existingRows = {};
    const finalRows = [];
    let removedDuplicates = 0;

    data.slice(1).forEach((sourceRow) => {
      const row = sourceRow.slice(0, headers.length);
      const id = String(row[idIndex] || "").trim();
      const isMaster = /^MASTER-(?:KBM|NKBM)-/.test(id);
      if (isMaster && existingRows[id] !== undefined) {
        removedDuplicates++;
        return;
      }
      if (isMaster) existingRows[id] = finalRows.length;
      finalRows.push(row);
    });

    let created = 0;
    let updated = 0;
    MASTER_ATTENDANCE_SCHEDULES.forEach((schedule) => {
      const rowData = {
        ScheduleID: schedule.ScheduleID,
        Type: normalizeScheduleType_(schedule.Type),
        TeacherID: schedule.TeacherID,
        TeacherSourceID: schedule.TeacherSourceID,
        SubjectOrActivityName: schedule.SubjectOrActivityName,
        ClassOrGroupName: schedule.ClassOrGroupName,
        DayOfWeek: schedule.DayOfWeek,
        StartTime: normalizeScheduleTime_(schedule.StartTime),
        EndTime: normalizeScheduleTime_(schedule.EndTime),
        IsActive: schedule.IsActive !== false,
      };
      const row = headers.map((header) => rowData[header] !== undefined ? rowData[header] : "");
      const existingRowIndex = existingRows[rowData.ScheduleID];
      if (existingRowIndex !== undefined) {
        finalRows[existingRowIndex] = row;
        updated++;
      } else {
        existingRows[rowData.ScheduleID] = finalRows.length;
        finalRows.push(row);
        created++;
      }
    });

    if (finalRows.length > 0) {
      sheet.getRange(2, 1, finalRows.length, headers.length).setValues(finalRows);
    }
    const oldRowCount = Math.max(0, data.length - 1);
    if (oldRowCount > finalRows.length) {
      sheet
        .getRange(2 + finalRows.length, 1, oldRowCount - finalRows.length, headers.length)
        .clearContent();
    }

    return {
      created,
      updated,
      removedDuplicates,
      total: MASTER_ATTENDANCE_SCHEDULES.length,
    };
  } finally {
    if (!lockAlreadyHeld) lock.releaseLock();
  }
}

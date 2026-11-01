const assert = require("assert");

function normalizeScheduleText(val) {
  return String(val || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parseDayOfWeek(val) {
  const norm = normalizeScheduleText(val);
  if (/senin|mon/.test(norm)) return "Senin";
  if (/selasa|tue/.test(norm)) return "Selasa";
  if (/rabu|wed/.test(norm)) return "Rabu";
  if (/kamis|thu/.test(norm)) return "Kamis";
  if (/jum|fri/.test(norm)) return "Jumat";
  if (/sabtu|sat/.test(norm)) return "Sabtu";
  if (/ahad|minggu|sun/.test(norm)) return "Ahad";
  return "";
}

function parseTimeRange(val, fallbackStart = "07:30", fallbackEnd = "08:30") {
  if (val === null || val === undefined) return { start: fallbackStart, end: fallbackEnd };
  
  // Excel decimal fraction of day (e.g. 0.3125 -> 07:30)
  if (typeof val === "number" && val > 0 && val < 1) {
    const totalMinutes = Math.round(val * 24 * 60);
    const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const m = String(totalMinutes % 60).padStart(2, "0");
    return { start: `${h}:${m}`, end: fallbackEnd };
  }

  const str = String(val).trim();
  
  // Range: "07:30 - 08:30" or "07.30 - 08.30" or "07.30-08.30" or "07:30 s/d 08:30"
  const rangeMatch = str.match(/(\d{1,2})[:.](\d{2})\s*(?:-|–|s\/?d|sampai|to)\s*(\d{1,2})[:.](\d{2})/i);
  if (rangeMatch) {
    const sH = rangeMatch[1].padStart(2, "0");
    const sM = rangeMatch[2];
    const eH = rangeMatch[3].padStart(2, "0");
    const eM = rangeMatch[4];
    return { start: `${sH}:${sM}`, end: `${eH}:${eM}` };
  }

  // Single time "07:30" or "07.30"
  const singleMatch = str.match(/(\d{1,2})[:.](\d{2})/);
  if (singleMatch) {
    const sH = singleMatch[1].padStart(2, "0");
    const sM = singleMatch[2];
    const endMinutes = Number(singleMatch[1]) * 60 + Number(singleMatch[2]) + 45;
    const eH = String(Math.floor(endMinutes / 60) % 24).padStart(2, "0");
    const eM = String(endMinutes % 60).padStart(2, "0");
    return { start: `${sH}:${sM}`, end: `${eH}:${eM}` };
  }

  // Jam ke (1, 2, 3...)
  const periodMatch = str.match(/(?:jam\s*(?:ke)?\s*)?(\d+)/i);
  if (periodMatch) {
    const num = Number(periodMatch[1]);
    const slots = {
      1: { start: "07:30", end: "08:15" },
      2: { start: "08:15", end: "09:00" },
      3: { start: "09:15", end: "10:00" },
      4: { start: "10:00", end: "10:45" },
      5: { start: "10:45", end: "11:30" },
      6: { start: "13:00", end: "13:45" },
      7: { start: "13:45", end: "14:30" },
      8: { start: "15:45", end: "16:30" },
    };
    if (slots[num]) return slots[num];
  }

  return { start: fallbackStart, end: fallbackEnd };
}

function parseSubjectAndTeacher(rawSubject, rawTeacher = "") {
  let subject = String(rawSubject || "").trim();
  let teacher = String(rawTeacher || "").trim();

  // If teacher is empty, check if subject contains "(Ust. Fauzi)" or "- Ust. Fauzi"
  if (!teacher && subject) {
    const parenMatch = subject.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (parenMatch) {
      subject = parenMatch[1].trim();
      teacher = parenMatch[2].trim();
    } else {
      const dashMatch = subject.match(/^(.*?)\s*[-–/]\s*(ust\.?|ustadz|guru|ustaz|kyai)\s*(.*)$/i);
      if (dashMatch) {
        subject = dashMatch[1].trim();
        teacher = (dashMatch[2] + " " + dashMatch[3]).trim();
      }
    }
  }

  // Infer Type
  let type = "KBM";
  const sNorm = normalizeScheduleText(subject);
  if (/tahfidz|tahfiz|hafalan|ziyadah|muroja|tasmi|tilawah|quran/.test(sNorm)) {
    type = "Hafalan";
  } else if (/sholat|solat|subuh|maghrib|isya|dzuhur|ashar|kajian|muhadharah|apel|makan|kebersihan|puasa/.test(sNorm)) {
    type = "Kegiatan";
  }

  return { subject, teacher, type };
}

function parseSmartScheduleMatrix(matrix, defaultClass = "KELAS 1") {
  if (!matrix || matrix.length < 2) return [];

  const headersKeywords = {
    hari: ["hari", "day", "haripelaksanaan"],
    jam: ["jam", "waktu", "pukul", "time", "jammulai", "jamke"],
    mapel: ["mapel", "matapelajaran", "pelajaran", "kegiatan", "subject", "materi", "kitab"],
    kelas: ["kelas", "rombel", "class", "group", "kelompok", "tingkat"],
    guru: ["guru", "ustadz", "ustaz", "pengampu", "pengajar", "teacher", "musyrif", "nama guru"],
  };

  // Find header row in first 15 rows
  let bestHeader = { rowIndex: -1, score: 0, cols: {} };
  for (let r = 0; r < Math.min(matrix.length, 15); r++) {
    const row = matrix[r] || [];
    const cols = {};
    let score = 0;
    row.forEach((cell, c) => {
      const norm = normalizeScheduleText(cell);
      if (!norm) return;
      for (const [key, aliases] of Object.entries(headersKeywords)) {
        if (aliases.some((a) => norm.includes(a))) {
          if (cols[key] === undefined || (key === "jam" && (norm.includes("waktu") || norm.includes("pukul")))) {
            cols[key] = c;
            score += 2;
          }
        }
      }
    });
    if (score > bestHeader.score) {
      bestHeader = { rowIndex: r, score, cols };
    }
  }

  if (bestHeader.rowIndex === -1 || bestHeader.score < 2) {
    return [];
  }

  const headerRow = matrix[bestHeader.rowIndex];
  const { cols } = bestHeader;
  const isTabular = cols.mapel !== undefined;

  const results = [];
  let lastSeenDay = "Senin";
  let lastSeenTime = { start: "07:30", end: "08:30" };

  if (isTabular) {
    // FORMAT 1: TABULAR
    for (let r = bestHeader.rowIndex + 1; r < matrix.length; r++) {
      const row = matrix[r];
      if (!row || !row.some((c) => String(c || "").trim())) continue;

      const rawDay = cols.hari !== undefined ? row[cols.hari] : "";
      const parsedDay = parseDayOfWeek(rawDay);
      if (parsedDay) lastSeenDay = parsedDay;

      const rawTime = cols.jam !== undefined ? row[cols.jam] : "";
      if (rawTime) lastSeenTime = parseTimeRange(rawTime, lastSeenTime.start, lastSeenTime.end);

      const rawSubject = row[cols.mapel];
      if (!String(rawSubject || "").trim()) continue;

      const rawTeacher = cols.guru !== undefined ? row[cols.guru] : "";
      const rawClass = cols.kelas !== undefined ? row[cols.kelas] : "";

      const { subject, teacher, type } = parseSubjectAndTeacher(rawSubject, rawTeacher);
      const className = String(rawClass || "").trim() || defaultClass;

      results.push({
        DayOfWeek: lastSeenDay,
        StartTime: lastSeenTime.start,
        EndTime: lastSeenTime.end,
        SubjectOrActivityName: subject,
        TeacherName: teacher,
        ClassOrGroupName: className,
        Type: type,
        IsActive: true,
      });
    }
  } else {
    // FORMAT 2: ROSTER MATRIX (Columns are Classes)
    const classCols = [];
    headerRow.forEach((cell, c) => {
      const cellStr = String(cell || "").trim();
      const norm = normalizeScheduleText(cellStr);
      if (!norm) return;
      if (/^(hari|day|jam|waktu|pukul|time|no|nomor|keterangan|durasi)$/i.test(norm)) return;
      if (/^jam(ke)?\d*$/i.test(norm)) return;
      if (c === cols.hari || c === cols.jam) return;
      if (cellStr.length <= 40) {
        classCols.push({ colIndex: c, className: cellStr });
      }
    });

    for (let r = bestHeader.rowIndex + 1; r < matrix.length; r++) {
      const row = matrix[r];
      if (!row || !row.some((c) => String(c || "").trim())) continue;

      const rawDay = cols.hari !== undefined ? row[cols.hari] : "";
      const parsedDay = parseDayOfWeek(rawDay);
      if (parsedDay) lastSeenDay = parsedDay;

      const rawTime = cols.jam !== undefined ? row[cols.jam] : "";
      if (rawTime) lastSeenTime = parseTimeRange(rawTime, lastSeenTime.start, lastSeenTime.end);

      classCols.forEach(({ colIndex, className }) => {
        const cellVal = row[colIndex];
        if (!cellVal || !String(cellVal).trim()) return;

        const { subject, teacher, type } = parseSubjectAndTeacher(cellVal, "");
        if (!subject) return;

        results.push({
          DayOfWeek: lastSeenDay,
          StartTime: lastSeenTime.start,
          EndTime: lastSeenTime.end,
          SubjectOrActivityName: subject,
          TeacherName: teacher,
          ClassOrGroupName: className,
          Type: type,
          IsActive: true,
        });
      });
    }
  }

  return results;
}

// === TESTS ===

// Test 1: Tabular format with merged days and "07.30 - 08.30"
const tabularSample = [
  ["PONDOK PESANTREN RAUDHATUL ULUM"],
  ["JADWAL PELAJARAN 2026/2027"],
  ["Hari", "Waktu", "Mata Pelajaran", "Kelas", "Guru Pengampu"],
  ["Senin", "07.30 - 08.30", "Tahfidz Al-Qur'an", "VII A", "Ust. Ahmad Fauzi"],
  ["", "08.30 - 09.15", "Aqidah Akhlak", "VII A", "Ust. Ridho"],
  ["Selasa", "07:30 - 08:30", "Fiqih Ibadah (Ust. Hasan)", "VII B", ""],
];
const res1 = parseSmartScheduleMatrix(tabularSample);
assert.strictEqual(res1.length, 3);
assert.strictEqual(res1[0].DayOfWeek, "Senin");
assert.strictEqual(res1[0].StartTime, "07:30");
assert.strictEqual(res1[0].EndTime, "08:30");
assert.strictEqual(res1[0].Type, "Hafalan");
assert.strictEqual(res1[0].TeacherName, "Ust. Ahmad Fauzi");
// Inherited day in row 2
assert.strictEqual(res1[1].DayOfWeek, "Senin");
assert.strictEqual(res1[1].StartTime, "08:30");
assert.strictEqual(res1[1].EndTime, "09:15");
// Extracted teacher from parentheses in row 3
assert.strictEqual(res1[2].DayOfWeek, "Selasa");
assert.strictEqual(res1[2].SubjectOrActivityName, "Fiqih Ibadah");
assert.strictEqual(res1[2].TeacherName, "Ust. Hasan");

// Test 2: Roster Matrix format (columns are classes)
const matrixSample = [
  ["Hari", "Jam Ke", "Waktu", "Kelas 7A", "Kelas 7B"],
  ["Senin", "1", "07:30 - 08:15", "Tahfidz (Ust. Fauzi)", "Bahasa Arab (Ust. Ali)"],
  ["", "2", "08:15 - 09:00", "Nahwu (Ust. Ridho)", "Tahfidz (Ust. Fauzi)"],
];
const res2 = parseSmartScheduleMatrix(matrixSample);
assert.strictEqual(res2.length, 4);
assert.strictEqual(res2[0].ClassOrGroupName, "Kelas 7A");
assert.strictEqual(res2[0].SubjectOrActivityName, "Tahfidz");
assert.strictEqual(res2[0].TeacherName, "Ust. Fauzi");
assert.strictEqual(res2[1].ClassOrGroupName, "Kelas 7B");
assert.strictEqual(res2[1].SubjectOrActivityName, "Bahasa Arab");
assert.strictEqual(res2[1].TeacherName, "Ust. Ali");

// Test 3: Realistic Pesantren Banner + Dot Time Format
const pesantrenBannerSample = [
  ["YAYASAN PONDOK PESANTREN SALAFIYAH"],
  ["KABUPATEN KUBU RAYA - KALIMANTAN BARAT"],
  ["ROSTER KBM SEMESTER GANJIL TAHUN AJARAN 2026/2027"],
  [],
  ["No", "Hari", "Jam Ke", "Waktu", "Mata Pelajaran / Kitab", "Kelas", "Pengampu"],
  ["1", "Senin", "1", "07.30 - 08.15", "Ziyadah Hafalan Juz 30", "1 Wustha", "K.H. Ahmad Muzakki, M.Pd"],
  ["2", "", "2", "08.15 - 09.00", "Nahwu Jurumiyah", "1 Wustha", "Ust. Fauzi, S.Pd.I"],
  ["3", "", "3", "09.15 - 10.00", "Muhadharah & Khitobah", "1 Wustha", "Ust. Ridho"],
];
const res3 = parseSmartScheduleMatrix(pesantrenBannerSample);
assert.strictEqual(res3.length, 3);
assert.strictEqual(res3[0].Type, "Hafalan");
assert.strictEqual(res3[0].StartTime, "07:30");
assert.strictEqual(res3[0].EndTime, "08:15");
assert.strictEqual(res3[0].TeacherName, "K.H. Ahmad Muzakki, M.Pd");
assert.strictEqual(res3[1].DayOfWeek, "Senin");
assert.strictEqual(res3[1].Type, "KBM");
assert.strictEqual(res3[2].Type, "Kegiatan");

console.log("All smart schedule parser tests passed!");

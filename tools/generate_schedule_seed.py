"""Reconcile the Apps Script attendance seed with the official Excel workbook."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import openpyxl


def extract_constant(source: str, name: str) -> tuple[list[dict], int, int]:
    marker = f"const {name} = "
    start = source.index(marker) + len(marker)
    decoder = json.JSONDecoder()
    value, consumed = decoder.raw_decode(source[start:])
    return value, start, start + consumed


def normalize_time(value: object) -> tuple[str, str]:
    matches = re.findall(r"\d{1,2}[.:]\d{2}", str(value or ""))
    if len(matches) != 2:
        raise ValueError(f"Invalid Jadwal_KBM.waktu value: {value!r}")
    return tuple(item.replace(".", ":").zfill(5) for item in matches)  # type: ignore[return-value]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("seed_file", type=Path)
    args = parser.parse_args()

    workbook = openpyxl.load_workbook(args.workbook, data_only=True, read_only=True)
    sheet = workbook["Jadwal_KBM"]
    rows = list(sheet.iter_rows(values_only=True))
    headers = [str(value or "").strip() for value in rows[0]]
    excel_rows = {
        str(row[headers.index("schedule_id")] or "").strip(): dict(zip(headers, row))
        for row in rows[1:]
    }
    period_rows = list(workbook["Periode"].iter_rows(values_only=True))
    period_headers = [str(value or "").strip() for value in period_rows[0]]
    periods = {
        str(row[period_headers.index("period_id")] or "").strip(): dict(
            zip(period_headers, row)
        )
        for row in period_rows[1:]
    }
    activity_rows = list(workbook["Kegiatan_Luar_KBM"].iter_rows(values_only=True))
    activity_headers = [str(value or "").strip() for value in activity_rows[0]]
    activity_by_id = {
        str(row[activity_headers.index("activity_id")] or "").strip(): dict(
            zip(activity_headers, row)
        )
        for row in activity_rows[1:]
    }
    link_rows = list(workbook["Pengajar_Kegiatan"].iter_rows(values_only=True))
    link_headers = [str(value or "").strip() for value in link_rows[0]]
    activity_teacher_ids: dict[str, set[str]] = {}
    for row in link_rows[1:]:
        record = dict(zip(link_headers, row))
        activity_teacher_ids.setdefault(str(record["activity_id"]), set()).add(
            str(record["teacher_id"])
        )

    source = args.seed_file.read_text(encoding="utf-8")
    teachers, _, _ = extract_constant(source, "MASTER_SCHEDULE_TEACHERS")
    schedules, start, end = extract_constant(source, "MASTER_ATTENDANCE_SCHEDULES")
    source_id_by_username = {
        str(item["Username"]).strip().lower(): str(item["TeacherSourceID"]).strip()
        for item in teachers
    }
    username_by_source_id = {
        source_id: username for username, source_id in source_id_by_username.items()
    }

    kbms = 0
    activity_count = 0
    for schedule in schedules:
        username = str(schedule.get("TeacherID") or "").strip().lower()
        schedule["TeacherSourceID"] = source_id_by_username.get(username, "")
        if not schedule["TeacherSourceID"]:
            raise ValueError(f"Teacher source ID not found for {username!r}")

        schedule_id = str(schedule.get("ScheduleID") or "")
        if schedule_id.startswith("MASTER-KBM-"):
            kbms += 1
            excel_id = schedule_id.removeprefix("MASTER-KBM-")
            excel_row = excel_rows.get(excel_id)
            if excel_row is None:
                raise ValueError(f"Excel row not found for {schedule_id}")
            schedule["StartTime"], schedule["EndTime"] = normalize_time(excel_row["waktu"])
            expected_source = str(excel_row.get("teacher_id") or "").strip()
            schedule.update(
                {
                    "Type": "KBM",
                    "TeacherID": username_by_source_id[expected_source],
                    "TeacherSourceID": expected_source,
                    "SubjectOrActivityName": str(excel_row["mata_pelajaran"] or "").strip(),
                    "ClassOrGroupName": f"{excel_row['kelas']} {excel_row['kelompok']}",
                    "DayOfWeek": str(excel_row["hari"] or "").strip(),
                    "IsActive": str(excel_row.get("status") or "Aktif").lower() == "aktif",
                }
            )
        elif schedule_id.startswith("MASTER-NKBM-"):
            activity_count += 1
            activity_match = re.search(r"MASTER-NKBM-(A\d+)-", schedule_id)
            if not activity_match or activity_match.group(1) not in activity_by_id:
                raise ValueError(f"Activity row not found for {schedule_id}")
            activity = activity_by_id[activity_match.group(1)]
            period = periods[str(activity["period_id"])]
            explicit_teachers = activity_teacher_ids.get(activity_match.group(1), set())
            if activity.get("teacher_id_utama"):
                explicit_teachers.add(str(activity["teacher_id_utama"]))
            if explicit_teachers and schedule["TeacherSourceID"] not in explicit_teachers:
                raise ValueError(
                    f"Teacher mismatch for {schedule_id}: "
                    f"{schedule['TeacherSourceID']} not in {sorted(explicit_teachers)}"
                )
            schedule.update(
                {
                    "Type": "Kegiatan",
                    "SubjectOrActivityName": str(activity["kegiatan"] or "").strip(),
                    "ClassOrGroupName": str(activity["kelompok"] or "").strip(),
                    "DayOfWeek": str(activity["hari"] or "").strip(),
                    "StartTime": str(period["mulai"] or "").replace(".", ":"),
                    "EndTime": str(period["selesai"] or "").replace(".", ":"),
                    "IsActive": True,
                }
            )

    if (kbms, activity_count, len(schedules)) != (342, 78, 420):
        raise ValueError(
            f"Unexpected schedule counts: KBM={kbms}, Kegiatan={activity_count}, total={len(schedules)}"
        )

    rendered = json.dumps(schedules, ensure_ascii=True, indent=2)
    args.seed_file.write_text(source[:start] + rendered + source[end:], encoding="utf-8")
    print(f"Updated {kbms} KBM and {activity_count} activity schedules.")


if __name__ == "__main__":
    main()

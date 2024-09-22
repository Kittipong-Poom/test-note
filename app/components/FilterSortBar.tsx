import React from "react";

interface FilterSortBarProps {
  setSelectedTag: (tag: string) => void;
  filterByTag: (tag: string) => void;
  filterByMonth: (month: number | "") => void;
  sortByDate: (order: "ascending" | "descending") => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  setSelectedTag,
  filterByTag,
  filterByMonth,
  sortByDate,
}) => {
  return (
    <div className="w-full flex justify-end gap-6 mt-4">
      <select
        className="border-2 p-2 rounded-lg border-black hover:bg-amber-300 duration-200"
        onChange={(e) => {
          const value = e.target.value;
          setSelectedTag(value);
          filterByTag(value);
        }}
      >
        <option value="">หมวดหมู่ Tag# ทั้งหมด</option>
        <option value="การบ้าน">การบ้าน</option>
        <option value="เกมส์">เกมส์</option>
        <option value="ทำงานบ้าน">ทำงานบ้าน</option>
        <option value="ไปเที่ยว">ไปเที่ยว</option>
        <option value="กีฬา">กีฬา</option>
      </select>

      <select
        className="border-2 p-2 rounded-lg border-black bg-white"
        onChange={(e) =>
          filterByMonth(e.target.value === "" ? "" : parseInt(e.target.value))
        }
      >
        <option value="">หมวดหมู่ ตามเดือนทั้งหมด</option>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString("th-TH", { month: "long" })}
          </option>
        ))}
      </select>

      <button
        className="border-2 p-2 rounded-lg border-black hover:bg-amber-300 duration-200 active:bg-amber-500"
        onClick={() => sortByDate("ascending")}
      >
        จัดเรียงจากน้อยไปมาก
      </button>
      <button
        className="border-2 p-2 rounded-lg border-black hover:bg-orange-300 duration-200 active:bg-orange-500"
        onClick={() => sortByDate("descending")}
      >
        จัดเรียงจากมากไปน้อย
      </button>
    </div>
  );
};

export default FilterSortBar;

import React from "react";

// Import CardData interface
import { CardData } from "./CardNote"; // Adjust the import path as needed

interface EditDialogProps {
  isOpen: boolean;
  editData: CardData | null;
  onClose: () => void;
  onSave: (data: CardData) => Promise<void>;
  nameCreator: string;
  setNameCreator: (name: string) => void;
  setEditData: (data: CardData) => void; // Add this line
}

const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  editData,
  onClose,
  onSave,
  nameCreator,
  setNameCreator,
  setEditData, // Destructure here
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({ ...editData, day_date: e.target.value });
    }
  };

  if (!isOpen || !editData) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูล Note</h2>
        <h2 className="text-xl">หัวข้อเรื่อง</h2>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="border border-gray-300 rounded p-2 w-full mb-4"
        />
        <h2 className="text-xl">สิ่งที่ต้องทำ</h2>
        <textarea
          value={editData.content}
          onChange={(e) =>
            setEditData({ ...editData, content: e.target.value })
          }
          className="border border-gray-300 rounded p-2 w-full mb-4"
        />
        <h2 className="text-xl">วันที่ต้องทำ</h2>
        <input
          type="date"
          value={editData.day_date}
          onChange={handleDateChange}
          className="border border-gray-300 rounded p-2 w-full mb-4"
        />
        <div className="w-full min-w-[200px] mt-6">
          <h2 className="text-xl mb-2">ชื่อผู้สร้าง</h2>
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="ชื่อผู้สร้าง..."
            value={nameCreator}
            onChange={(e) => setNameCreator(e.target.value)}
          />
        </div>
        <div className="w-full min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">เลือกประเภท Tag</h1>
          {/* เพิ่ม label สำหรับ dropdown */}
          <select
            value={editData.tag} // Bind the input value to the tag from editData
            onChange={(e) => setEditData({ ...editData, tag: e.target.value })} // Update the tag in editData
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          >
            <option>เลือกประเภท#....</option>
            <option value="การบ้าน">การบ้าน</option>
            <option value="เกมส์">เกมส์</option>
            <option value="ทำงานบ้าน">ทำงานบ้าน</option>
            <option value="ไปเที่ยว">ไปเที่ยว</option>
            <option value="กีฬา">กีฬา</option>
          </select>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-800 duration-200"
            onClick={() => onSave(editData)}
          >
            บันทึก
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 duration-200 active:bg-gray-300" onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialog;

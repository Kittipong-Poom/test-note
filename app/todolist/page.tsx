"use client";
import React from "react";

import { useState, useEffect } from "react";
import CardNote from "../components/CardNote";
import axios from "axios";
import Swal from "sweetalert2";

const Page: React.FC = () => {
  const [namecreator, setNameCreator] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const getTodayThaiDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0"); // Add leading 0 if needed
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add leading 0 if needed
    const year = (today.getFullYear() + 543).toString(); // Convert to Buddhist Era
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  };

  useEffect(() => {
    const today = new Date();
    const defaultDate = today.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD
    setSelectedDate(defaultDate);

    // ดึงชื่อผู้ใช้จาก localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setNameCreator(storedUser);
    }
  }, []); // เรียกใช้เมื่อ component ถูก mount

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedDate(selected);
  };

  

  const handleSubmit = async () => {
    if (!title || !content || !namecreator || !selectedDate || !tag) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return; // ไม่ให้ดำเนินการต่อถ้ายังไม่ได้กรอกข้อมูล
    }
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const newNote = {
        title,
        content,
        my_create: namecreator,
        day_date: selectedDate,
        tag,
      };
      const response = await axios.post(`${baseURL}/createtodo`, newNote);

      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "สร้างข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
        setTitle("");
        setContent("");
        setTag("");
        setSelectedDate(new Date().toISOString().split("T")[0]);

      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create note");
    }
  };

  return (
    <section className="mt-5 flex flex-col  items-center justify-center h-[800px]">
      <div className="bg-slate-900 w-fit hover:bg-[#708F51] duration-300 p-3 rounded-lg mb-4 ">
        <h1 className="text-white text-3xl capitalize text-center">
          note eazy app
        </h1>
      </div>

      <div className=" w-[1200px] gap-9 justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  border-2 p-5 bg-[#acd6e9] rounded-lg border-black">
        <div className="w-full max-w-sm min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">หัวข้อเรื่อง</h1>
          <input
            value={title}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="หัวข้อ..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-full max-w-sm min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">สิ่งที่ต้องทำ</h1>
          <input
            value={content}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="รายละเอียด..."
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="w-full max-w-sm min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">ชื่อผู้สร้าง</h1>
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="ชื่อผู้สร้าง..."
            value={namecreator} // แสดงค่า default ที่ดึงมา
            onChange={(e) => setNameCreator(e.target.value)} // หากต้องการให้สามารถแก้ไขได้
          />
        </div>

        <div className="w-full max-w-sm min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">วันที่ต้องทำ</h1>
          <input
            type="date"
            value={selectedDate} // Set the value to selectedDate
            onChange={handleDateChange} // Update state when a date is selected
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 bg-white text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          />
          <p className="mt-2 text-sm text-slate-600">
            วันที่เลือก: {selectedDate ? getTodayThaiDate() : ""}
          </p>
          {/* ใช้ flex กับ justify-center เพื่อให้ปุ่มอยู่ตรงกลาง */}
          <div className="flex w-full justify-start mt-6">
            <button
              onClick={handleSubmit}
              className="items-center border-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 duration-200 rounded-md"
              disabled={
                !title || !content || !namecreator || !selectedDate || !tag
              } // ปิดการใช้งานปุ่มถ้ายังไม่ได้กรอกข้อมูล
            >
              ตกลง
            </button>
          </div>
        </div>
        <div className="w-full max-w-sm min-w-[200px] mt-6">
          <h1 className="text-xl mb-2">เลือกประเภท Tag</h1>
          {/* เพิ่ม label สำหรับ dropdown */}
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
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
      </div>
      <CardNote />
    </section>
  );
};

export default Page;

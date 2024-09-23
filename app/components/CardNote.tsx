"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import EditDialog from "./EditDialog";
import Pagination from "./Pagination";
import FilterSortBar from "./FilterSortBar";

export interface CardData {
  id: number;
  title: string;
  content: string;
  my_create: string;
  day_date: string;
  tag: string;
}

const CardNote: React.FC<{
  cards: CardData[];
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
}> = ({ cards, setCards }) => {
  const [filteredCards, setFilteredCards] = useState<CardData[]>(cards);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CardData | null>(null);
  const [namecreator, setNameCreator] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "ascending"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // จำนวนการ์ดต่อหน้า
  const indexOfLastCard = currentPage * itemsPerPage;
  const indexOfFirstCard = indexOfLastCard - itemsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  // Open dialog for editing พอเปิด Dialog ขึ้นมาใหม่จะ ให้แสดงวันที่เป็น Default ที่เรากรอก
  const handleEditClick = (card: CardData) => {
    setEditData({
      ...card,
      day_date: new Date(card.day_date).toISOString().split("T")[0], // แปลงให้เป็นรูปแบบ YYYY-MM-DD
    });
    setIsDialogOpen(true);
  };

  // Close the edit dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Sort cards by date อันนี้เรียงจาก น้อยไปหามาก และ จากมากไปหาน้อย
  const sortByDate = (order: "ascending" | "descending") => {
    const sorted = [...filteredCards].sort((a, b) => {
      const dateA = new Date(a.day_date).getTime();
      const dateB = new Date(b.day_date).getTime();
      return order === "ascending" ? dateA - dateB : dateB - dateA;
    });
    setFilteredCards(sorted);
    setSortOrder(order); // Update the sort order state
  };

  // Filter cards by month แบ่งหมวดหมู่ตามเดือน
  const filterByMonth = (month: number | "") => {
    if (month === "") {
      setFilteredCards(cards); // Show all cards if no month is selected
    } else {
      const filtered = cards.filter(
        (card) => new Date(card.day_date).getMonth() + 1 === month
      );
      setFilteredCards(filtered); // Show only cards from the selected month
    }
  };

  const filterByTag = (tag: string) => {
    if (tag === "") {
      setFilteredCards(cards); // Show all cards
    } else {
      const filtered = cards.filter((card) => card.tag === tag);
      setFilteredCards(filtered);
    }
  };

  // Handle save Update เวลามีการแก้ไขข้อมูล
  const handleSaveChanges = async (data: CardData) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      await axios.put(`${baseURL}/edittodolist/${data.id}`, data);
      setCards(cards.map((card) => (card.id === data.id ? data : card)));
      setFilteredCards(
        filteredCards.map((card) => (card.id === data.id ? data : card))
      );
      setIsDialogOpen(false);
      Swal.fire({
        title: "แก้ไขข้อมูลสำเร็จ",
        icon: "success",
        timer: 1000,
      });
    } catch (error) {
      console.error("Error updating card:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขข้อมูลได้",
        icon: "error",
      });
    }
  };

  // Fetch cards from API Get ข้อมูลมาจากหลังบ้าน
  const fetchCards = async () => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      setIsLoading(true); // เริ่มการโหลด
      const response = await axios.get<CardData[]>(`${baseURL}/todolist`);

      if (Array.isArray(response.data)) {
        setCards(response.data);
        setFilteredCards(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // หยุดการโหลด
    }
  };

  // useEffect ส่วนนี้จะเอาทำไว้ทำ วิธีมี ข้อมูลใหม่จะได้ hook ขึ้นมาทันที
  useEffect(() => {
    setFilteredCards(cards); // Update filtered cards only when cards change
  }, [cards]); // This ensures filtering happens only when necessary

  // useEffect ส่วนนี้เอาไว้ทำเวลามีการ get ข้อมูลจากหลังบ้านมาและดึง localStorage มาใช้
  useEffect(() => {
    fetchCards();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setNameCreator(storedUser);
    }
  }, []);

  // Handle card delete
  const handleDelete = async (id: number) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจว่าจะลบ?",
        text: "ลบไปแล้ว ข้อมูลไม่กลับมานะ!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ใช่! ผมจะลบ",
      });
      if (result.isConfirmed) {
        await axios.delete(`${baseURL}/todolist/${id}`);
        const updatedCards = cards.filter((card) => card.id !== id);
        setCards(updatedCards);
        setFilteredCards(updatedCards); // Update filteredCards when deleting
        Swal.fire({
          title: "ลบแล้วข้อมูลแล้ว",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error delete card", error);
      alert("Fail to delete card");
    }
  };

  return (
    <section className="mx-auto justify-center">
      {isLoading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <div>
          <FilterSortBar
            setSelectedTag={setSelectedTag}
            filterByTag={filterByTag}
            filterByMonth={filterByMonth}
            sortByDate={sortByDate}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.map((card) => (
              <div
                key={card.id}
                className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96"
              >
                <div className="p-4">
                  <div className="flex flex-1 justify-between">
                    <h5 className="mb-2 text-slate-800 text-xl font-semibold">
                      {card.title}
                    </h5>
                    <h5 className="mb-2 text-slate-800 text-xl font-semibold underline">
                      #{card.tag}
                    </h5>
                  </div>
                  <p className="text-slate-600 leading-normal font-light">
                    {card.content}
                  </p>

                  <div className="flex justify-between mt-4">
                    <h5 className="text-slate-800 text-xl font-semibold items-center">
                      <div>ชื่อผู้สร้าง</div>
                      {card.my_create}
                    </h5>
                    <h5 className="text-slate-800 text-xl font-semibold ">
                      <div>ชื่อผู้สร้าง</div>
                      {new Date(card.day_date).toLocaleDateString("th-TH")}
                    </h5>
                  </div>
                  <div className="justify-end flex">
                    <button
                      className="rounded-md mr-3 bg-green-600 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg hover:animate-pulse"
                      type="button"
                      onClick={() => handleEditClick(card)}
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => handleDelete(card.id)}
                      className="rounded-md bg-red-500 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg hover:animate-bounce"
                      type="button"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Modal for editing */}
            {isDialogOpen && editData && (
              <EditDialog
                isOpen={isDialogOpen}
                editData={editData}
                onClose={handleCloseDialog}
                onSave={handleSaveChanges}
                nameCreator={namecreator}
                setNameCreator={setNameCreator}
                setEditData={setEditData}
              />
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCards.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
};

export default CardNote;

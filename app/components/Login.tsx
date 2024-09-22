"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
const Login: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const response = await axios.post(`${baseURL}/login`, {
        user,
        password,
      });

      if (response.status === 200) {
        // Save the token to localStorage or cookie
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", user);
        // Redirect to the todo list
        router.push("/todolist");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex bg-white items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
        <div className="w-[500px] xl:mx-auto shadow-md p-4 2xl:max-w-md">
          <div className="mb-2 flex justify-center"></div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Login For Note Easy
          </h2>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div>ชื่อผู้ใช้งาน: Johndoe</div>
            <div>รหัสผ่าน: john1234</div>
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  User
                </label>
                <div className="mt-2">
                  <input
                    placeholder="user"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Password"
                    type="password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Login
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

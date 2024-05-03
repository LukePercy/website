import React from "react";
import userData from "../constants/data";
import { useRouter } from "next/router";
import Link from "next/link";
import Clock from "../components/Clock";
export default function Footer() {
  const router = useRouter();
  
  return (
    <div className="bg-[#F1F1F1] dark:bg-gray-900">
      <div className="max-w-6xl  mx-auto px-4 py-10 md:py-20">
        <div className="h-0.5 w-full bg-white">
        </div>
        <div className="flex flex-col space-y-4 justify-between md:space-y-0 md:flex-row md:items-center">
          <div className="dark:text-white">
            <p>&copy; {userData.name}. All Rights Reserved.</p>
          </div>
          <div><Clock/></div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import userData from "../constants/data";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();
  
  return (
    <div className="bg-[#F1F1F1] dark:bg-gray-900">
      <div className="max-w-6xl  mx-auto px-4 py-10 md:py-20">
        <div className="h-0.5 w-full bg-white">
        </div>
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between md:items-center mt-8">
          <div className="dark:text-white">
            <p>&copy; {userData.name}. All Rights Reserved.</p>
          </div>
          <div className="space-x-4 flex flex-row items-center text-gray-300 dark:text-gray-700">
            <p>
          <Link href="/trading-cards-terms">
            <a>
              Trading Cards Terms{" "}
              {router.asPath === "/trading-cards-terms"}
            </a>
          </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

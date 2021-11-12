import React from "react";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import userData from "../constants/data";

export default function Hero() {
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
  return (
    <div className="flex flex-row justify-center items-start overflow-hidden">
      {/* Text container */}

      <div className="w-full md:w-2/3 text-center md:text-left lg:p-20 xsm:p-5 sm:p-0">
        <RoughNotationGroup show={true}>
        <RainbowHighlight color={colors[1]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Agilist.
            </h1>
          </RainbowHighlight>
          <RainbowHighlight color={colors[3]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Writer.
            </h1>
          </RainbowHighlight>
          <RainbowHighlight color={colors[2]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Developer.
            </h1>
          </RainbowHighlight>
        </RoughNotationGroup>
      </div>
      {/* Image container */}
      <div className="hidden lg:block relative mx-auto w-full md:w-1/4 mr-50 mt-20">
        <div className="w-auto">
          <img src={userData.avatarUrl} alt="Luke Percy profile picture" className="shadow rounded-full"/>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import { Parallax, useParallaxController } from "react-scroll-parallax";

export default function Hero() {
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
  const parallaxController = useParallaxController();

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController.update();
  
  return (
    <div className="relative flex flex-row justify-center items-start overflow-hidden">
      <Parallax speed={-40} onLoad={handleLoad} easing='easeInOut'>
        <video autoPlay muted loop className="static w-screen xsm:invisible sm:visible">
             <source src="mixkit-cup-full-of-coffee-209.mp4" type="video/mp4"/>
        </video>
      </Parallax>
      {/* Text container */}
      <div className="absolute w-7/12 text-center md:text-left lg:p-20 xsm:p-5 sm:p-0">
      <Parallax speed={10}>
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
        </Parallax>
      </div>

    </div>
  );
}

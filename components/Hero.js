import React, {useState} from "react";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import { Parallax, useParallaxController } from "react-scroll-parallax";

export default function Hero() {
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
  const parallaxController = useParallaxController();

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController.update();
  const [coffee,setCoffee]=useState(true);
  
  let handleClick = () => {
    setCoffee(!coffee);
  };
  
  return (
    <div>
    <div className="relative flex flex-row justify-center items-start overflow-hidden md:pb-20 h-screen">
      <div className="absolute xsm:invisible sm:invisible lg:visible">
      <Parallax speed={-40} onLoad={handleLoad} easing='easeInOut'>
          {
          coffee ? 
          <>  <video autoPlay muted loop className="w-screen">
                <source src="mixkit-cup-full-of-coffee-209.mp4" type="video/mp4"/>
             </video>
             </> : 
             <>
              <video autoPlay muted loop className="w-screen">
             <source src="video.mp4" type="video/mp4"/> 
             </video>
            </>
          }
      </Parallax>
      </div>
      {/* Text container */}
      <div className="w-7/12 text-center md:text-left lg:pt-20 md:pt-20 xsm:pt-10 xsm:pb-10 sm:pt-15">
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
        <div><p className="text-center">Scroll<span> &#9660;</span></p></div>
        </Parallax>
      </div>
    </div>
    <div className="form-check form-switch xsm:invisible sm:invisible lg:visible">
        <input 
            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" 
            type="checkbox" 
            role="switch" 
            id="coffee" 
            onClick={handleClick}
          />
    </div>
  </div>
  );
}
